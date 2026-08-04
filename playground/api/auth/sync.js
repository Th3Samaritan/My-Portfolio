import { sql } from '@vercel/postgres';

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

  const { username, iv, encrypted, password_hash, admin_recovery } = req.body || {};
  if (!username || !iv || !encrypted) {
    return json(res, 400, { error: 'Missing required fields: username, iv, encrypted.' });
  }

  try {
    const { rowCount } = await sql`
      UPDATE gym_users
      SET iv = ${iv}, encrypted = ${encrypted}, password_hash = ${password_hash || ''},
          admin_recovery = ${admin_recovery || null}, updated_at = NOW()
      WHERE username = ${username.toLowerCase().trim()}
    `;
    if (rowCount === 0) return json(res, 404, { error: 'User not found.' });
    return json(res, 200, { ok: true });
  } catch (err) {
    console.error('sync error:', err);
    return json(res, 500, { error: 'Sync failed: ' + (err.message || 'unknown') });
  }
}
