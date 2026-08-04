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

  const { username } = req.body || {};
  if (!username || typeof username !== 'string') {
    return json(res, 400, { error: 'Username is required.' });
  }

  try {
    const { rows } = await sql`
      SELECT username, joined_at, iv, encrypted, password_hash, admin_recovery
      FROM gym_users WHERE username = ${username.toLowerCase().trim()}
    `;
    if (rows.length === 0) return json(res, 404, { error: 'No account found with that username.' });

    const r = rows[0];
    return json(res, 200, {
      username: r.username,
      joinedAt: r.joined_at,
      iv: r.iv,
      encrypted: r.encrypted,
      passwordHash: r.password_hash,
      adminRecovery: r.admin_recovery || '',
    });
  } catch (err) {
    console.error('login lookup error:', err);
    return json(res, 500, { error: 'Login lookup failed: ' + (err.message || 'unknown') });
  }
}
