import { sql } from '@vercel/postgres';

export default async function handler(req, res) {
  try {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    if (req.method === 'OPTIONS') return res.status(200).end();
    if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

    const { username, iv, encrypted, password_hash, admin_recovery } = req.body || {};
    if (!username || !iv || !encrypted) {
      return res.status(400).json({ error: 'Missing required fields: username, iv, encrypted.' });
    }

    const { rowCount } = await sql`
      UPDATE gym_users
      SET iv = ${iv}, encrypted = ${encrypted}, password_hash = ${password_hash || ''},
          admin_recovery = ${admin_recovery || null}, updated_at = NOW()
      WHERE username = ${username.toLowerCase().trim()}
    `;
    if (rowCount === 0) return res.status(404).json({ error: 'User not found.' });
    return res.status(200).json({ ok: true });
  } catch (err) {
    console.error('sync:', err);
    return res.status(500).json({ error: err.message || 'Sync failed' });
  }
}
