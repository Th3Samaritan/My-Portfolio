import { sql } from '@vercel/postgres';

export default async function handler(req, res) {
  try {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    if (req.method === 'OPTIONS') return res.status(200).end();
    if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

    const { username } = req.body || {};
    if (!username || typeof username !== 'string') {
      return res.status(400).json({ error: 'Username is required.' });
    }

    const { rows } = await sql`
      SELECT username, joined_at, iv, encrypted, password_hash, admin_recovery
      FROM gym_users WHERE username = ${username.toLowerCase().trim()}
    `;
    if (rows.length === 0) return res.status(404).json({ error: 'No account found with that username.' });

    const r = rows[0];
    return res.status(200).json({
      username: r.username,
      joinedAt: r.joined_at,
      iv: r.iv,
      encrypted: r.encrypted,
      passwordHash: r.password_hash,
      adminRecovery: r.admin_recovery || '',
    });
  } catch (err) {
    console.error('login:', err);
    return res.status(500).json({ error: err.message || 'Login lookup failed' });
  }
}
