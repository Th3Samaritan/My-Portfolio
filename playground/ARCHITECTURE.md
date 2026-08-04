# The GYM — Authentication Architecture

## Design goals

- Zero plaintext secrets in the public repo
- Cross-device login with just username + password
- All profile data encrypted client-side — the server never sees plaintext
- Password never stored anywhere — it derives a cryptographic key then is discarded
- Admin can recover any account without knowing the user's password
- Simple, zero-maintenance infrastructure (Vercel + Postgres)

---

## Cryptographic primitives

Everything uses the browser-native **Web Crypto API** — no external libraries, no npm dependencies.

| Purpose | Algorithm | Key source |
|---------|-----------|------------|
| Key derivation | PBKDF2 (SHA-256, 600k iterations) | Password + salt (`the-gym:<username>`) |
| User encryption | AES-256-GCM | 32-byte derived key |
| Admin recovery | RSA-OAEP (SHA-256) | Admin key pair (public in app, private offline) |
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
│    { username, email, name, xp, level,                   │
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
│ 6. Submit to Vercel API                                  │
│    POST /api/auth/register                               │
│    Body: { username, joined_at, iv, encrypted,           │
│            password_hash, admin_recovery }               │
├─────────────────────────────────────────────────────────┤
│ 7. Vercel API route                                      │
│    → INSERT INTO gym_users (Vercel Postgres)             │
│    → Return OK                                           │
│    → Show user recovery phrase (BIP39, 12 words)         │
└─────────────────────────────────────────────────────────┘
```

## Login flow

```
┌─────────────────────────────────────────────────────────┐
│ 1. User enters username + password                       │
├─────────────────────────────────────────────────────────┤
│ 2. Derive userKey (same PBKDF2 from registration)        │
├─────────────────────────────────────────────────────────┤
│ 3. POST /api/auth/login { username }                     │
│    → Returns encrypted record from Postgres              │
├─────────────────────────────────────────────────────────┤
│ 4. Decrypt with AES-GCM(userKey, iv_from_record)         │
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
└─────────────────────────────────────────────────────────┘
```

## Password reset / recovery

### Method 1: Recovery phrase (primary)

On registration, the user is shown a **12-word BIP39 mnemonic** derived from their private key. They should write it down.

To recover:
1. Enter recovery phrase on any device
2. Phrase → regenerates the original userKey
3. Decrypt profile → set new password
4. Re-encrypt with new key → POST to `/api/auth/sync`

### Method 2: Admin reset (emergency)

You hold the RSA private key offline. Run the admin recovery tool:

```bash
node tools/admin-recover.mjs <username>
```

It fetches their record, decrypts `adminRecovery` with your RSA key to get their `userKey`, then decrypts their full profile.

---

## Storage (Vercel Postgres)

### `gym_users` table

```sql
CREATE TABLE gym_users (
  username       TEXT PRIMARY KEY,
  joined_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  iv             TEXT NOT NULL,            -- base64 12-byte AES-GCM IV
  encrypted      TEXT NOT NULL,            -- base64 AES-GCM ciphertext
  password_hash  TEXT NOT NULL DEFAULT '', -- base64 SHA-256 of password
  admin_recovery TEXT DEFAULT NULL,        -- base64 RSA-OAEP ciphertext of userKey
  updated_at     TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
```

The `encrypted` field, when decrypted with the user's key, contains:
```json
{
  "username": "ada",
  "email": "ada@example.com",
  "name": "Ada Lovelace",
  "passwordHash": "...",
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

## API routes (Vercel serverless functions)

| Route | Method | Purpose |
|-------|--------|---------|
| `/api/auth/register` | POST | Insert new encrypted user record |
| `/api/auth/login` | POST | Fetch encrypted record by username |
| `/api/auth/sync` | POST | Update encrypted record (profile sync, password reset) |

All routes include CORS headers for cross-origin requests from GitHub Pages.
Register endpoint has in-memory rate limiting (15 req/min per IP).

---

## File structure

```
api/auth/register.js    Register endpoint — writes to Postgres
api/auth/login.js       Login lookup — reads from Postgres
api/auth/sync.js        Profile sync — updates Postgres
js/crypto.js            Key derivation, encrypt/decrypt, admin RSA functions
js/auth.js              Register, login, logout, profile sync, recovery flows
js/identity.js          UI — login/register forms with fields
js/store.js             localStorage profile management
schema.sql              Database migration (run once in Vercel Postgres dashboard)
config.js               Branding + admin public key + optional Supabase for leaderboard
```

---

## Security properties

| Concern | Mitigation |
|---------|-----------|
| Password brute-force | PBKDF2 with 600k iterations + SHA-256 makes each attempt expensive (~0.3s) |
| Same password, different users | Salt includes username → different derived keys |
| Database compromised | AES-256-GCM ciphertext is indistinguishable from random without the key |
| Admin private key leaked | Only affects admin recovery; rotate key pair. Historical data stays encrypted with user keys |
| Man-in-the-middle | HTTPS + CORS-restricted API routes on Vercel |
| User loses password AND recovery phrase | Data is permanently inaccessible. No backdoor without the user's key |
| Mass registration spam | Rate limiting (15 POSTs/min/IP) on the register endpoint |

---

## Key management

| Key | Location | Format |
|-----|----------|--------|
| Admin RSA public key | `config.js` (in repo, public) | SPKI base64 |
| Admin RSA private key | Offline (never in repo or any cloud service) | PKCS8 base64 |
| User AES key | Derived on-the-fly from password, never stored | 32 bytes |
| Recovery phrase | Shown once to user on registration | 12 BIP39 words |
| Vercel Postgres URL | Vercel env var `POSTGRES_URL` (auto-provisioned) | Connection string |

---

## Deploying to Vercel

1. Connect the `My-Portfolio` repo to a Vercel project with root directory set to `playground/`
2. In the Vercel dashboard, go to **Storage** → create a **Vercel Postgres** database
3. Run `schema.sql` in the Vercel Postgres SQL editor to create the `gym_users` table
4. `@vercel/postgres` automatically picks up `POSTGRES_URL` — no env vars to set manually
5. Deploy — the API routes in `api/auth/` are automatically detected
