/* ============================================================
   auth.js — registration, login, profile sync, recovery.

   Depends on crypto.js (Web Crypto API) and store.js (localStorage).
   ============================================================ */

import { getState, setState, profile, subscribe } from './store.js';
import {
  deriveKey, encryptProfile, decryptProfile, passwordHash,
  adminEncryptUserKey, keyToMnemonic, mnemonicToKey, configureAdminKey,
} from './crypto.js';
import { toast, modal } from './ui.js';

/* ------------------------------------------------------- configuration */

const GITHUB_OWNER = 'Th3Samaritan';
const GITHUB_REPO = 'the-gym';
const USERS_RAW_URL = `https://raw.githubusercontent.com/${GITHUB_OWNER}/${GITHUB_REPO}/main/data/users.json`;
const DISPATCH_URL = `https://api.github.com/repos/${GITHUB_OWNER}/${GITHUB_REPO}/actions/workflows/register.yml/dispatches`;

let authToken = null; // GitHub PAT for dispatch — set via config or profile dialog

export function setAuthToken(token) {
  authToken = token;
}

/* ----------------------------------------------------------- state keys */

const SESSION_KEY = 'the-gym-session';
const USERS_CACHE_KEY = 'the-gym-users-cache';

/* ------------------------------------------------------------- session */

export function isLoggedIn() {
  try {
    const session = JSON.parse(localStorage.getItem(SESSION_KEY) || 'null');
    return !!(session && session.username);
  } catch { return false; }
}

export function currentUser() {
  try {
    const session = JSON.parse(localStorage.getItem(SESSION_KEY) || 'null');
    return session || null;
  } catch { return null; }
}

function saveSession(username, email, name) {
  localStorage.setItem(SESSION_KEY, JSON.stringify({ username, email, name, loggedInAt: Date.now() }));
}

export function logout() {
  localStorage.removeItem(SESSION_KEY);
  subscribe(() => {})();
}

/* ------------------------------------------------------- fetch helpers */

async function fetchUsers() {
  const response = await fetch(USERS_RAW_URL, { cache: 'no-cache' });
  if (!response.ok) throw new Error('Unable to reach the user registry');
  const data = await response.json();
  localStorage.setItem(USERS_CACHE_KEY, JSON.stringify(data));
  return data;
}

function getCachedUsers() {
  try {
    return JSON.parse(localStorage.getItem(USERS_CACHE_KEY) || 'null');
  } catch { return null; }
}

/* -------------------------------------------------------- registration */

/**
 * Register a new user.
 * 1. Derive key from password
 * 2. Build profile (merge with any existing localStorage progress)
 * 3. Encrypt profile
 * 4. Generate admin recovery blob
 * 5. Submit to GitHub Action
 * 6. Show recovery phrase
 */
export async function registerUser({ username, password, email, name }) {
  username = username.toLowerCase().trim();

  // 1. Derive key
  const userKey = await deriveKey(password, username);

  // 2. Build profile from current localStorage state
  const state = getState();
  const profileData = {
    username,
    email: email.trim(),
    name: name.trim(),
    xp: state.xp || 0,
    level: state.level || 1,
    lessonsDone: state.lessonsDone || [],
    challengesCleared: state.challengesCleared || [],
    streak: state.streak || 0,
    achievements: state.achievements || [],
    courses: state.courses || [],
    mastery: state.mastery || {},
    schedule: state.schedule || {},
    joinedAt: new Date().toISOString(),
  };

  // 3. Encrypt
  const { iv, encrypted, passwordHash: pwdHash } = await encryptProfile(userKey, profileData, password);
  const adminRecovery = await adminEncryptUserKey(userKey);

  // 4. Build user record
  const userRecord = {
    username,
    joinedAt: profileData.joinedAt,
    iv,
    encrypted,
    passwordHash: pwdHash,
    adminRecovery: adminRecovery || '',
  };

  // 5. Submit to GitHub Action
  if (!authToken) throw new Error('Registration token not configured. Add it in Profile → Settings.');

  const response = await fetch(DISPATCH_URL, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${authToken}`,
      'Content-Type': 'application/json',
      Accept: 'application/vnd.github+json',
    },
    body: JSON.stringify({
      ref: 'main',
      inputs: {
        username: userRecord.username,
        joined_at: userRecord.joinedAt,
        iv: userRecord.iv,
        encrypted: userRecord.encrypted,
        password_hash: userRecord.passwordHash,
        admin_recovery: userRecord.adminRecovery,
      },
    }),
  });

  if (response.status === 404) {
    throw new Error('Registration workflow not found. Make sure register.yml is on the main branch.');
  }
  if (response.status === 401 || response.status === 403) {
    throw new Error('Permission denied. Check that the PAT has workflow scope.');
  }
  if (!response.ok) {
    throw new Error('Registration dispatch failed (HTTP ' + response.status + ')');
  }

  // 6. Generate recovery phrase (one-time)
  const recoveryPhrase = keyToMnemonic(userKey);

  // 7. Save session locally
  saveSession(username, email, name);

  // 8. Invalidate cache so next login fetches the new users.json
  localStorage.removeItem(USERS_CACHE_KEY);

  return { username, recoveryPhrase };
}

/* ------------------------------------------------------------- login */

/**
 * Login with username + password.
 * 1. Derive key
 * 2. Fetch users.json (try cache first)
 * 3. Find user record
 * 4. Decrypt profile
 * 5. Verify password hash
 * 6. Restore profile to localStorage
 */
export async function loginUser(username, password) {
  username = username.toLowerCase().trim();

  // 1. Derive key
  const userKey = await deriveKey(password, username);

  // 2. Fetch users.json (try cache, then network)
  let usersData = getCachedUsers();
  try {
    usersData = await fetchUsers();
  } catch {
    if (!usersData) throw new Error('Cannot reach the user registry. Check your connection.');
  }

  // 3. Find user
  const users = usersData.users || [];
  const record = users.find(u => u.username === username);
  if (!record) throw new Error('No account found with that username.');

  // 4. Decrypt
  const profileData = await decryptProfile(userKey, record.encrypted, record.iv);
  if (!profileData) throw new Error('Invalid password.');

  // 5. Verify password hash
  const pwdHash = await passwordHash(password);
  if (pwdHash !== profileData.passwordHash && pwdHash !== record.passwordHash) {
    throw new Error('Invalid password.');
  }

  // 6. Restore profile to localStorage (merge with current to avoid data loss)
  await restoreProfile(profileData, username);

  // 7. Save session
  saveSession(username, profileData.email, profileData.name);

  return profileData;
}

/* ---------------------------------------------------- profile restore */

async function restoreProfile(profileData, username) {
  const state = getState();

  // Merge: if the user has local progress newer than what's in the cloud, keep it.
  // Strategy: cloud profile is the baseline. Local progress since last sync is merged.
  // For now, just restore from cloud and keep local as override.
  const merged = {
    ...state,
    username,
    xp: Math.max(state.xp || 0, profileData.xp || 0),
    level: Math.max(state.level || 1, profileData.level || 1),
    lessonsDone: [...new Set([...(state.lessonsDone || []), ...(profileData.lessonsDone || [])])],
    challengesCleared: [...new Set([...(state.challengesCleared || []), ...(profileData.challengesCleared || [])])],
    streak: Math.max(state.streak || 0, profileData.streak || 0),
    achievements: [...new Set([...(state.achievements || []), ...(profileData.achievements || [])])],
    courses: [...new Set([...(state.courses || []), ...(profileData.courses || [])])],
    mastery: { ...(profileData.mastery || {}), ...(state.mastery || {}) },
    email: profileData.email,
    name: profileData.name,
  };

  setState(merged);
  subscribe(() => {})();
}

/* --------------------------------------------------- profile sync (push) */

/**
 * Push current profile to the cloud.
 * Used after significant progress (challenge clear, lesson done, etc.)
 * Throttled — only syncs if last sync was > 5 min ago.
 */
let lastSyncTime = 0;

export async function syncProfile(password) {
  if (!isLoggedIn()) return;
  if (Date.now() - lastSyncTime < 300000) return; // 5 min throttle

  const session = currentUser();
  if (!session) return;

  const username = session.username.toLowerCase().trim();
  const userKey = await deriveKey(password, username);
  const state = getState();
  const p = profile();

  const profileData = {
    username,
    email: session.email || '',
    name: session.name || p.displayName || '',
    xp: state.xp || 0,
    level: state.level || 1,
    lessonsDone: state.lessonsDone || [],
    challengesCleared: state.challengesCleared || [],
    streak: state.streak || 0,
    achievements: state.achievements || [],
    courses: state.courses || [],
    mastery: state.mastery || {},
    updatedAt: new Date().toISOString(),
  };

  const { iv, encrypted } = await encryptProfile(userKey, profileData, password);
  const adminRecovery = await adminEncryptUserKey(userKey);

  if (!authToken) return;

  await fetch(DISPATCH_URL, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${authToken}`,
      'Content-Type': 'application/json',
      Accept: 'application/vnd.github+json',
    },
    body: JSON.stringify({
      ref: 'main',
      inputs: {
        username,
        iv,
        encrypted,
        password_hash: await passwordHash(password),
        admin_recovery: adminRecovery || '',
      },
    }),
  });

  lastSyncTime = Date.now();
}

/* ---------------------------------------------------------- recovery */

export async function recoverWithPhrase(recoveryPhrase, newPassword, username) {
  username = username.toLowerCase().trim();
  const oldKey = mnemonicToKey(recoveryPhrase);
  if (!oldKey) throw new Error('Invalid recovery phrase. Must be exactly 12 words.');

  let usersData = getCachedUsers();
  try { usersData = await fetchUsers(); } catch { /* use cache */ }
  if (!usersData) throw new Error('Cannot reach the user registry.');

  const users = usersData.users || [];
  const record = users.find(u => u.username === username);
  if (!record) throw new Error('No account found with that username.');

  // Decrypt with old key
  const profileData = await decryptProfile(oldKey, record.encrypted, record.iv);
  if (!profileData) throw new Error('Could not decrypt your data with that phrase.');

  // Derive new key from new password
  const newKey = await deriveKey(newPassword, username);
  const { iv, encrypted } = await encryptProfile(newKey, profileData, newPassword);
  const adminRecovery = await adminEncryptUserKey(newKey);

  // Push updated record
  if (!authToken) throw new Error('Registration token not configured.');

  await fetch(DISPATCH_URL, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${authToken}`,
      'Content-Type': 'application/json',
      Accept: 'application/vnd.github+json',
    },
    body: JSON.stringify({
      ref: 'main',
      inputs: {
        username,
        iv,
        encrypted,
        password_hash: await passwordHash(newPassword),
        admin_recovery: adminRecovery || '',
      },
    }),
  });

  // Save session
  saveSession(username, profileData.email, profileData.name);
  await restoreProfile(profileData, username);

  // Invalidate cache
  localStorage.removeItem(USERS_CACHE_KEY);

  return profileData;
}
