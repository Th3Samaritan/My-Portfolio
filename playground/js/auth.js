/* ============================================================
   auth.js — registration, login, profile sync, recovery.

   Calls Vercel API routes backed by Vercel Postgres.
   Encryption/decryption stays client-side via Web Crypto API.
   No secrets ever reach the browser or public repo.
   ============================================================ */

import { getState, setState, profile, subscribe } from './store.js';
import {
  deriveKey, encryptProfile, decryptProfile, passwordHash,
  adminEncryptUserKey, keyToMnemonic, mnemonicToKey,
} from './crypto.js';

const API_BASE = '/api/auth';
const REGISTER_URL = `${API_BASE}/register`;
const LOGIN_URL = `${API_BASE}/login`;
const SYNC_URL = `${API_BASE}/sync`;

const SESSION_KEY = 'the-gym-session';

/* ------------------------------------------------------------- session */

export function isLoggedIn() {
  try {
    const s = JSON.parse(localStorage.getItem(SESSION_KEY) || 'null');
    return !!(s && s.username);
  } catch { return false; }
}

export function currentUser() {
  try {
    return JSON.parse(localStorage.getItem(SESSION_KEY) || 'null');
  } catch { return null; }
}

function saveSession(username, email, name) {
  localStorage.setItem(SESSION_KEY, JSON.stringify({ username, email, name, loggedInAt: Date.now() }));
}

export function logout() {
  localStorage.removeItem(SESSION_KEY);
  subscribe(() => {})();
}

/* ------------------------------------------------------------ helpers */

async function apiPost(url, body) {
  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  const text = await res.text();
  let data;
  try {
    data = JSON.parse(text);
  } catch {
    throw new Error('Server error — is the Vercel Postgres database connected?');
  }
  if (!res.ok) throw new Error(data.error || `Request failed (${res.status})`);
  return data;
}

/* -------------------------------------------------------- registration */

export async function registerUser({ username, password, email, name }) {
  username = username.toLowerCase().trim();

  const userKey = await deriveKey(password, username);
  const state = getState();

  const profileData = {
    username,
    email: email.trim(),
    name: name.trim(),
    xp: state.xp || 0,
    level: state.level || 1,
    lessonsDone: state.lessonsDone || [],
    challengesCleared: state.challengesCleared || [],
    streak: state.streak?.current || 0,
    achievements: state.achievements || {},
    courses: state.courses || [],
    mastery: state.mastery || {},
    schedule: state.schedule || {},
    joinedAt: new Date().toISOString(),
  };

  const { iv, encrypted, passwordHash: pwdHash } = await encryptProfile(userKey, profileData, password);
  const adminRecovery = await adminEncryptUserKey(userKey);

  await apiPost(REGISTER_URL, {
    username,
    joined_at: profileData.joinedAt,
    iv,
    encrypted,
    password_hash: pwdHash,
    admin_recovery: adminRecovery || '',
  });

  const recoveryPhrase = keyToMnemonic(userKey);
  saveSession(username, email, name);
  return { username, recoveryPhrase };
}

/* ------------------------------------------------------------- login */

export async function loginUser(username, password) {
  username = username.toLowerCase().trim();

  const userKey = await deriveKey(password, username);
  const record = await apiPost(LOGIN_URL, { username });

  const profileData = await decryptProfile(userKey, record.encrypted, record.iv);
  if (!profileData) throw new Error('Invalid password.');

  const pwdHash = await passwordHash(password);
  if (pwdHash !== profileData.passwordHash && pwdHash !== record.passwordHash) {
    throw new Error('Invalid password.');
  }

  await restoreProfile(profileData, username);
  saveSession(username, profileData.email, profileData.name);
  return profileData;
}

/* ---------------------------------------------------- profile restore */

async function restoreProfile(profileData, username) {
  const state = getState();

  const merged = {
    ...state,
    username,
    xp: Math.max(state.xp || 0, profileData.xp || 0),
    level: Math.max(state.level || 1, profileData.level || 1),
    lessonsDone: [...new Set([...(state.lessonsDone || []), ...(profileData.lessonsDone || [])])],
    challengesCleared: [...new Set([...(state.challengesCleared || []), ...(profileData.challengesCleared || [])])],
    streak: {
      ...(state.streak || { current: 0, longest: 0, lastDay: null }),
      current: Math.max(state.streak?.current || 0, profileData.streak || 0),
    },
    achievements: { ...(profileData.achievements || {}), ...(state.achievements || {}) },
    courses: [...new Set([...(state.courses || []), ...(profileData.courses || [])])],
    mastery: { ...(profileData.mastery || {}), ...(state.mastery || {}) },
    email: profileData.email,
    name: profileData.name,
  };

  setState(merged);
  subscribe(() => {})();
}

/* --------------------------------------------------- profile sync (push) */

let lastSyncTime = 0;

export async function syncProfile(password) {
  if (!isLoggedIn()) return;
  if (Date.now() - lastSyncTime < 300000) return;

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
    streak: state.streak?.current || 0,
    achievements: state.achievements || {},
    courses: state.courses || [],
    mastery: state.mastery || {},
    updatedAt: new Date().toISOString(),
  };

  const { iv, encrypted } = await encryptProfile(userKey, profileData, password);
  const adminRecovery = await adminEncryptUserKey(userKey);

  await apiPost(SYNC_URL, {
    username,
    iv,
    encrypted,
    password_hash: await passwordHash(password),
    admin_recovery: adminRecovery || '',
  });

  lastSyncTime = Date.now();
}

/* ---------------------------------------------------------- recovery */

export async function recoverWithPhrase(recoveryPhrase, newPassword, username) {
  username = username.toLowerCase().trim();
  const oldKey = mnemonicToKey(recoveryPhrase);
  if (!oldKey) throw new Error('Invalid recovery phrase. Must be exactly 24 words.');

  const record = await apiPost(LOGIN_URL, { username });

  const profileData = await decryptProfile(oldKey, record.encrypted, record.iv);
  if (!profileData) throw new Error('Could not decrypt your data with that phrase.');

  const newKey = await deriveKey(newPassword, username);
  const { iv, encrypted } = await encryptProfile(newKey, profileData, newPassword);
  const adminRecovery = await adminEncryptUserKey(newKey);

  await apiPost(SYNC_URL, {
    username,
    iv,
    encrypted,
    password_hash: await passwordHash(newPassword),
    admin_recovery: adminRecovery || '',
  });

  saveSession(username, profileData.email, profileData.name);
  await restoreProfile(profileData, username);
  return profileData;
}
