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

export default async function handler(req, res) {
  try {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    if (req.method === 'OPTIONS') return res.status(200).end();
    if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

    const ip = req.headers['x-forwarded-for'] || req.socket?.remoteAddress || '0.0.0.0';
    if (!allow(ip)) return res.status(429).json({ error: 'Too many requests. Wait a minute.' });

    const { username, joined_at, iv, encrypted, password_hash, admin_recovery } = req.body || {};
    if (!username || !iv || !encrypted) {
      return res.status(400).json({ error: 'Missing required fields: username, iv, encrypted.' });
    }
    if (typeof username !== 'string' || username.length > 20 || !/^[a-zA-Z0-9_-]{3,20}$/.test(username)) {
      return res.status(400).json({ error: 'Invalid username format.' });
    }

    await sql`
      INSERT INTO gym_users (username, joined_at, iv, encrypted, password_hash, admin_recovery)
      VALUES (${username.toLowerCase().trim()}, ${joined_at || new Date().toISOString()}, ${iv}, ${encrypted}, ${password_hash || ''}, ${admin_recovery || null})
    `;
    return res.status(201).json({ ok: true });
  } catch (err) {
    if (err.code === '23505') return res.status(409).json({ error: 'Username already taken.' });
    console.error('register:', err);
    return res.status(500).json({ error: err.message || 'Registration failed' });
  }
}
