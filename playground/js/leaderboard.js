/* ============================================================
   leaderboard.js — the Hall of Fame.

   Two modes, chosen automatically:

   LOCAL  (default, zero setup)
     Your own record is kept in this browser. The board shows you
     and anyone else who has trained on this device.

   SHARED (when config.js has Supabase credentials)
     Records are pushed to a public table and the board shows
     everyone. Falls back to local silently if the network fails —
     a leaderboard outage should never block someone's learning.
   ============================================================ */

import { SUPABASE } from '../config.js';
import { TRACKS } from '../data/curriculum.js';
import * as store from './store.js';

const LOCAL_KEY = 'the-gym-board';

export function isCloudEnabled() {
  return Boolean(SUPABASE.url && SUPABASE.anonKey);
}

/* ------------------------------------------------------------- own record */

/** Build the current athlete's record from local progress. */
export function myRecord() {
  const state = store.getState();
  const profile = state.profile;
  if (!profile.username) return null;

  let cleared = 0;
  let lessonsDone = 0;
  for (const track of TRACKS) {
    cleared += store.trackStats(track).cleared;
    lessonsDone += store.lessonStats(track).done;
  }

  return {
    username: profile.username,
    display_name: profile.name || profile.username,
    xp: state.xp,
    level: store.levelInfo(state.xp).level,
    cleared,
    lessons_done: lessonsDone,
    streak: store.liveStreak(),
    courses: profile.courses || [],
    updated_at: new Date().toISOString(),
  };
}

/* ------------------------------------------------------------- local store */

function readLocalBoard() {
  try {
    return JSON.parse(localStorage.getItem(LOCAL_KEY) || '[]');
  } catch {
    return [];
  }
}

function writeLocalBoard(rows) {
  try {
    localStorage.setItem(LOCAL_KEY, JSON.stringify(rows));
  } catch {
    /* storage full or blocked — the board is not worth failing over */
  }
}

function upsertLocal(record) {
  const rows = readLocalBoard().filter((row) => row.username !== record.username);
  rows.push(record);
  writeLocalBoard(rows);
  return rows;
}

/* ----------------------------------------------------------- supabase REST */

function headers() {
  return {
    apikey: SUPABASE.anonKey,
    Authorization: 'Bearer ' + SUPABASE.anonKey,
    'Content-Type': 'application/json',
  };
}

const endpoint = () => `${SUPABASE.url.replace(/\/$/, '')}/rest/v1/${SUPABASE.table}`;

async function pushRemote(record) {
  const response = await fetch(endpoint() + '?on_conflict=username', {
    method: 'POST',
    headers: { ...headers(), Prefer: 'resolution=merge-duplicates,return=minimal' },
    body: JSON.stringify(record),
  });
  if (!response.ok) throw new Error('Board rejected the update (HTTP ' + response.status + ')');
}

async function fetchRemote(limit) {
  const url = `${endpoint()}?select=*&order=xp.desc.nullslast&limit=${limit}`;
  const response = await fetch(url, { headers: headers() });
  if (!response.ok) throw new Error('Could not read the board (HTTP ' + response.status + ')');
  return response.json();
}

/* --------------------------------------------------------------- the API */

/**
 * Publish the current athlete's progress.
 * @returns {{ mode:'shared'|'local', error?:string }}
 */
export async function publish() {
  const record = myRecord();
  if (!record) return { mode: 'local', error: 'No profile yet.' };

  upsertLocal(record);

  if (!isCloudEnabled()) return { mode: 'local' };

  try {
    await pushRemote(record);
    return { mode: 'shared' };
  } catch (error) {
    return { mode: 'local', error: (error && error.message) || String(error) };
  }
}

/**
 * Read the board.
 * @returns {{ rows:[], mode:'shared'|'local', error?:string }}
 */
export async function board(limit = 50) {
  const local = readLocalBoard();

  // Always fold in the live local record, so your own row is never stale.
  const mine = myRecord();
  const merged = mine ? [...local.filter((r) => r.username !== mine.username), mine] : local;

  if (!isCloudEnabled()) {
    return { rows: rank(merged), mode: 'local' };
  }

  try {
    const remote = await fetchRemote(limit);
    // Our own freshly-computed row wins over whatever the server last saw.
    const rows = mine ? [...remote.filter((r) => r.username !== mine.username), mine] : remote;
    return { rows: rank(rows), mode: 'shared' };
  } catch (error) {
    return { rows: rank(merged), mode: 'local', error: (error && error.message) || String(error) };
  }
}

/** Sort by XP, then challenges cleared, then streak. */
function rank(rows) {
  return [...rows]
    .sort(
      (a, b) =>
        (b.xp || 0) - (a.xp || 0) ||
        (b.cleared || 0) - (a.cleared || 0) ||
        (b.streak || 0) - (a.streak || 0)
    )
    .map((row, index) => ({ ...row, rank: index + 1 }));
}

/** Check whether a username is already taken (shared mode only). */
export async function isUsernameTaken(username) {
  const wanted = String(username).toLowerCase();

  if (!isCloudEnabled()) {
    return readLocalBoard().some((row) => String(row.username).toLowerCase() === wanted);
  }

  try {
    const url = `${endpoint()}?select=username&username=eq.${encodeURIComponent(username)}&limit=1`;
    const response = await fetch(url, { headers: headers() });
    if (!response.ok) return false;
    const rows = await response.json();
    return rows.length > 0;
  } catch {
    return false; // never block sign-up on a network problem
  }
}
