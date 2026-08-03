/* ============================================================
   sweep-web.mjs — Run every Web challenge solution through a
   real browser (Chromium via Playwright) so DOM assertions are
   verified in CI, not just manually.

     node tools/sweep-web.mjs

   Requires Playwright:  npx playwright install chromium
   ============================================================ */

import { createServer } from 'http';
import { readFileSync, existsSync } from 'fs';
import { resolve, extname } from 'path';
import { chromium } from 'playwright';

const PORT = 8742;
const BASE = process.cwd();

const MIME = {
  '.html': 'text/html; charset=utf-8',
  '.js':   'application/javascript; charset=utf-8',
  '.mjs':  'application/javascript; charset=utf-8',
  '.css':  'text/css; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.svg':  'image/svg+xml',
  '.png':  'image/png',
};

const server = createServer((req, res) => {
  let filePath = resolve(BASE, '.' + new URL(req.url, 'http://x').pathname);
  if (existsSync(filePath) && !existsSync(resolve(filePath))) { /* directory? serve index */ }
  if (!existsSync(filePath) || !filePath.startsWith(BASE)) {
    res.writeHead(404);
    res.end('Not found');
    return;
  }
  const ext = extname(filePath).toLowerCase();
  res.writeHead(200, { 'Content-Type': MIME[ext] || 'application/octet-stream' });
  res.end(readFileSync(filePath));
});

await new Promise((r) => server.listen(PORT, r));
console.log(`Local server on http://localhost:${PORT}`);

const browser = await chromium.launch();
const page = await browser.newPage();

page.on('console', (msg) => {
  if (msg.type() === 'error') console.error('[browser]', msg.text());
});

const url = `http://localhost:${PORT}/`;
console.log(`Navigating to ${url}...`);
await page.goto(url, { waitUntil: 'networkidle' });

// Injection uses the app's own imports.
const results = await page.evaluate(async () => {
  const v = '?b=' + Date.now();
  const { TRACKS } = await import('./data/curriculum.js' + v);
  const runner = await import('./js/runner.js' + v);

  const output = [];
  for (const track of TRACKS) {
    if (track.kind !== 'web') continue;
    for (const ch of track.challenges) {
      const r = await runner.runWebChallenge(ch, ch.solution, {});
      const passed = r.results.filter((x) => x.passed).length;
      const failed = r.results.filter((x) => !x.passed).map((x) => x.name);
      output.push({ id: ch.id, title: ch.title, passed, total: r.results.length, failed });
    }
  }
  return output;
});

let problems = 0;
for (const r of results) {
  if (r.failed.length) {
    problems += 1;
    console.log(`\n[${r.id}] ${r.title}  (${r.passed}/${r.total})`);
    r.failed.forEach((f) => console.log(`  FAIL ${f}`));
  } else {
    console.log(`[${r.id}] ok ${r.passed}/${r.total}`);
  }
}

console.log(`\n${results.length} run, ${problems} with problems`);
await browser.close();
server.close();
process.exit(problems ? 1 : 0);
