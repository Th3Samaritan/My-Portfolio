# The GYM — Authentication Architecture

## Design goals

- Zero servers, zero databases — the repo is the source of truth
- Cross-device login with just username + password
- All data encrypted at rest in the public repo
- Password never stored anywhere — it derives a cryptographic key then is discarded
- Admin can recover any account without knowing the user's password
- Works offline after first login (SW caches `users.json`)

---

## Cryptographic primitives

Everything uses the browser-native **Web Crypto API** — no external libraries, no npm dependencies.

| Purpose | Algorithm | Key source |
|---------|-----------|------------|
| Key derivation | PBKDF2 (SHA-256, 600k iterations) | Password + salt (`the-gym:<username>`) |
| User encryption | AES-256-GCM | 32-byte derived key |
| Admin recovery | RSA-OAEP (SHA-256) | Admin key pair (public in app, private in GitHub Secret) |
| Random IVs/salts | `crypto.getRandomValues` | Browser CSPRNG |

---

## Registration flow

```
┌─────────────────────────────────────────────────────────┐
│ 1. User fills form                                       │
│    username, password, email, display name                │
├─────────────────────────────────────────────────────────┤
│ 2. Key derivation                                        │
│    PBKDF2(password, salt="the-gym:<username>") → 32-byte │
│    → userKey (AES-256 symmetric)                         │
├─────────────────────────────────────────────────────────┤
│ 3. Profile assembly                                      │
│    { username, email, name, passwordHash, xp, level,     │
│      lessonsDone, challengesCleared, streak, joinedAt }  │
├─────────────────────────────────────────────────────────┤
│ 4. Encryption                                            │
│    AES-GCM(userKey, random_iv, profile_json) → ciphertext│
│    Also: SHA-256(password) stored in blob for fast verify│
├─────────────────────────────────────────────────────────┤
│ 5. Admin backup                                          │
│    RSA-OAEP(adminPublicKey, userKey) → adminRecoveryBlob │
│    So you can decrypt without their password             │
├─────────────────────────────────────────────────────────┤
│ 6. Submit to GitHub Action                               │
│    POST /repos/{owner}/{repo}/actions/workflows/         │
│         register.yml/dispatches                          │
│    Body: { username, encryptedBlob, adminRecoveryBlob,   │
│            publicInfo: { username, joinedAt } }          │
├─────────────────────────────────────────────────────────┤
│ 7. GitHub Action                                         │
│    → Pull latest users.json                              │
│    → Append new user record                              │
│    → Commit + push                                       │
│    → Show user recovery phrase (BIP39, 12 words)         │
└─────────────────────────────────────────────────────────┘
```

## Login flow (instant, client-side)

```
┌─────────────────────────────────────────────────────────┐
│ 1. User enters username + password                       │
├─────────────────────────────────────────────────────────┤
│ 2. Derive userKey (same PBKDF2 from registration)        │
├─────────────────────────────────────────────────────────┤
│ 3. Fetch data/users.json                                 │
│    → From raw.githubusercontent.com (or SW cache)        │
├─────────────────────────────────────────────────────────┤
│ 4. Find user's record by username                        │
│    → Decrypt with AES-GCM(userKey, iv_from_record)       │
├─────────────────────────────────────────────────────────┤
│ 5. Verify                                                │
│    → Decryption succeeds → key was correct               │
│    → Check passwordHash matches SHA-256(password)         │
│    → Both pass → "Login successful"                      │
│    → Either fails → "Invalid credentials"                │
├─────────────────────────────────────────────────────────┤
│ 6. Restore profile                                       │
│    → Load XP, level, lessons, challenges, streak         │
│    → Write to localStorage (the-gym-v1)                  │
│    → Publish to Hall of Fame if Supabase configured      │
└─────────────────────────────────────────────────────────┘
```

## Password reset / recovery

### Method 1: Recovery phrase (primary)

On registration, the user is shown a **12-word BIP39 mnemonic** derived from their private key. They should write it down.

To recover:
1. Enter recovery phrase on any device
2. Phrase → regenerates the original userKey
3. Decrypt profile → set new password
4. Re-encrypt with new key → push updated blob

### Method 2: Admin reset (emergency)

You hold the RSA private key in a GitHub Secret. Run the admin recovery script:

```bash
node tools/admin-recover.mjs <username>
```

It fetches their record, decrypts `adminRecoveryBlob` with your RSA key to get their `userKey`, then decrypts their full profile. You can give them a temporary recovery phrase via any channel.

---

## Storage format (`data/users.json`)

```json
{
  "version": 1,
  "users": [
    {
      "username": "ada",
      "joinedAt": "2026-08-03T22:00:00Z",
      "iv": "<base64 12-byte AES-GCM IV>",
      "encrypted": "<base64 AES-GCM ciphertext>",
      "passwordHash": "<base64 SHA-256 of password>",
      "adminRecovery": "<base64 RSA-OAEP ciphertext of userKey>"
    }
  ]
}
```

The `encrypted` field, when decrypted with the user's key, contains:
```json
{
  "username": "ada",
  "email": "ada@example.com",
  "name": "Ada Lovelace",
  "xp": 1250,
  "level": 5,
  "lessonsDone": ["py-l1", "py-l2", ...],
  "challengesCleared": ["py-f1", ...],
  "streak": 7,
  "achievements": [...],
  "courses": ["python", "rust"],
  "mastery": { "python": {...}, ... }
}
```

---

## File structure

```
js/crypto.js       Key derivation, encrypt/decrypt, admin RSA functions
js/auth.js         Register, login, logout, profile sync, recovery flows
js/identity.js     Updated UI — login/register forms with fields
js/store.js        Extended — profile import/export from auth system
data/users.json    All encrypted user records
.github/workflows/register.yml  GitHub Action — writes users.json via workflow_dispatch
tools/admin-recover.mjs         Offline admin recovery script (uses Node crypto)
```

---

## Security properties

| Concern | Mitigation |
|---------|-----------|
| Password brute-force | PBKDF2 with 600k iterations + SHA-256 makes each attempt expensive (~0.3s) |
| Same password, different users | Salt includes username → different derived keys |
| Repo is public, users.json visible | AES-256-GCM ciphertext is indistinguishable from random without the key |
| Admin private key leaked | Only affects future registrations; rotate key pair. Historical data stays encrypted with user keys |
| Man-in-the-middle on GitHub CDN | HTTPS + repo signature; service worker validates cached content |
| User loses password AND recovery phrase | Data is permanently inaccessible. No backdoor without the user's key |
| Concurrent registrations | GitHub Action with `concurrency: register` serializes writes |

---

## Key management

| Key | Location | Format |
|-----|----------|--------|
| Admin RSA public key | `js/crypto.js` (in repo, public) | SPKI base64 |
| Admin RSA private key | GitHub Secret `ADMIN_PRIVATE_KEY` | PKCS8 base64 |
| User AES key | Derived on-the-fly from password, never stored | 32 bytes |
| Recovery phrase | Shown once to user on registration | 12 BIP39 words |
| GitHub PAT (for commits) | GitHub Secret `REGISTER_PAT` | fine-grained, repo-only |
