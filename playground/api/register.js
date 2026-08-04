/* ============================================================
   Vercel Serverless Function — registration proxy

   Receives encrypted registration payload from the client and
   forwards it to the GitHub workflow_dispatch API using the
   REGISTER_PAT environment variable (set in Vercel dashboard).

   The PAT never touches the browser or the public repo.
   ============================================================ */

export const config = {
  runtime: 'edge',
};

export default async function handler(request) {
  if (request.method !== 'POST') {
    return new Response('Method not allowed', { status: 405 });
  }

  const token = process.env.REGISTER_PAT;
  if (!token) {
    return new Response(JSON.stringify({ error: 'Server misconfigured — REGISTER_PAT not set.' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  let body;
  try {
    body = await request.json();
  } catch {
    return new Response(JSON.stringify({ error: 'Invalid JSON body.' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  const { username, iv, encrypted, password_hash, admin_recovery, joined_at } = body;

  if (!username || !iv || !encrypted) {
    return new Response(JSON.stringify({ error: 'Missing required fields.' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  try {
    const response = await fetch(
      'https://api.github.com/repos/Th3Samaritan/the-gym/actions/workflows/register.yml/dispatches',
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
          Accept: 'application/vnd.github+json',
        },
        body: JSON.stringify({
          ref: 'main',
          inputs: {
            username: String(username),
            joined_at: String(joined_at || ''),
            iv: String(iv),
            encrypted: String(encrypted),
            password_hash: String(password_hash || ''),
            admin_recovery: String(admin_recovery || ''),
          },
        }),
      }
    );

    if (response.status === 204) {
      return new Response(JSON.stringify({ ok: true }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    if (response.status === 404) {
      return new Response(JSON.stringify({ error: 'Registration workflow not found.' }), {
        status: 502,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const text = await response.text();
    return new Response(JSON.stringify({ error: `GitHub API returned ${response.status}: ${text}` }), {
      status: response.status,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (err) {
    return new Response(JSON.stringify({ error: `Proxy error: ${err.message}` }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
