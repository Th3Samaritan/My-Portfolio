import { sql } from '@vercel/postgres';

const RATE_WINDOW = 60000;
const RATE_MAX = 15;
const RATE_STORE = new Map();

function allow(ip) {
  const now = Date.now();
  const e = RATE_STORE.get(ip);
  if (!e || now > e.resetAt) { RATE_STORE.set(ip, { count: 1, resetAt: now + RATE_WINDOW }); return true; }
  if (e.count >= RATE_MAX) return false;
  e.count++;
  return true;
}

function json(res, status, body) {
  res.setHeader('Content-Type', 'application/json');
  res.status(status).send(JSON.stringify(body));
}

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return json(res, 405, { error: 'Method not allowed' });

  const ip = req.headers['x-forwarded-for'] || req.socket?.remoteAddress || '0.0.0.0';
  if (!allow(ip)) return json(res, 429, { error: 'Too many requests. Wait a minute.' });

  const { username, joined_at, iv, encrypted, password_hash, admin_recovery } = req.body || {};
  if (!username || !iv || !encrypted) {
    return json(res, 400, { error: 'Missing required fields: username, iv, encrypted.' });
  }
  if (typeof username !== 'string' || username.length > 20 || !/^[a-zA-Z0-9_-]{3,20}$/.test(username)) {
    return json(res, 400, { error: 'Invalid username format.' });
  }

  try {
    await sql`
      INSERT INTO gym_users (username, joined_at, iv, encrypted, password_hash, admin_recovery)
      VALUES (${username.toLowerCase().trim()}, ${joined_at || new Date().toISOString()}, ${iv}, ${encrypted}, ${password_hash || ''}, ${admin_recovery || null})
    `;
    return json(res, 201, { ok: true });
  } catch (err) {
    if (err.code === '23505') return json(res, 409, { error: 'Username already taken.' });
    console.error('register insert error:', err);
    return json(res, 500, { error: 'Database write failed: ' + (err.message || 'unknown') });
  }
}
