/**
 * Blog & Notebook Index Builder
 * Scans markdown files, parses frontmatter, generates index.json.
 *
 * Usage: node scripts/build-index.js
 */

const fs = require('fs');
const path = require('path');

const WORDS_PER_MINUTE = 200;

function parseFrontmatter(content) {
    const lines = content.split(/\r?\n/);
    if (lines[0].trim() !== '---') return null;

    const endIdx = lines.indexOf('---', 1);
    if (endIdx === -1) return null;

    const meta = {};
    for (let i = 1; i < endIdx; i++) {
        const line = lines[i].trim();
        if (!line) continue;
        const colonIdx = line.indexOf(':');
        if (colonIdx === -1) continue;

        const key = line.slice(0, colonIdx).trim();
        let value = line.slice(colonIdx + 1).trim();

        if (value.startsWith('[') && value.endsWith(']')) {
            value = value
                .slice(1, -1)
                .split(',')
                .map(s => s.trim().replace(/['"]/g, ''))
                .filter(Boolean);
        } else {
            value = value.replace(/^['"]|['"]$/g, '');
        }
        meta[key] = value;
    }

    const bodyStart = endIdx + 1;
    const body = lines.slice(bodyStart).join('\n').trim();
    return { meta, body };
}

function countWords(text) {
    return text.split(/\s+/).filter(Boolean).length;
}

function estimateReadingTime(wordCount) {
    const minutes = Math.max(1, Math.ceil(wordCount / WORDS_PER_MINUTE));
    return `${minutes} min read`;
}

function buildIndex(dirPath, outputFile, urlBasePath) {
    const files = fs.readdirSync(dirPath)
        .filter(f => f.endsWith('.md'))
        .sort();

    const entries = [];

    for (const file of files) {
        const filePath = path.join(dirPath, file);
        const content = fs.readFileSync(filePath, 'utf-8');
        const parsed = parseFrontmatter(content);

        if (!parsed) {
            console.warn(`Warning: No frontmatter found in ${file}, skipping.`);
            continue;
        }

        const { meta, body } = parsed;
        const slug = file.replace(/\.md$/, '').toLowerCase();
        const wordCount = countWords(body);
        const readingTime = estimateReadingTime(wordCount);

        entries.push({
            slug,
            title: meta.title || slug.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase()),
            date: meta.date || new Date().toISOString().split('T')[0],
            description: meta.description || '',
            tags: meta.tags || [],
            readingTime,
            wordCount,
            url: urlBasePath ? `${urlBasePath}/${slug}` : slug
        });
    }

    entries.sort((a, b) => new Date(b.date) - new Date(a.date));

    fs.writeFileSync(outputFile, JSON.stringify(entries, null, 2) + '\n');
    console.log(`Built ${outputFile}: ${entries.length} entries`);
    return entries;
}

const blogDir = path.join(__dirname, '..', 'blog-posts');
const blogOutput = path.join(blogDir, 'index.json');
let blogEntries = [];

if (fs.existsSync(blogDir)) {
    blogEntries = buildIndex(blogDir, blogOutput, 'https://th3samaritan.github.io/My-Portfolio/blog-posts') || [];
} else {
    console.warn('blog-posts/ directory not found, skipping.');
}

const notebookDir = path.join(__dirname, '..', 'notebook-pages');
const notebookOutput = path.join(notebookDir, 'index.json');
if (fs.existsSync(notebookDir)) {
    buildIndex(notebookDir, notebookOutput, null);
} else {
    console.warn('notebook-pages/ directory not found, skipping.');
}

// Generate RSS Feed
const rssOutput = path.join(__dirname, '..', 'rss.xml');
const SITE_URL = 'https://th3samaritan.github.io/My-Portfolio';
const BLOG_URL = `${SITE_URL}/blog.html`;

const rssItems = blogEntries.map(post => {
    const postUrl = `${BLOG_URL}?post=${post.slug}`;
    const pubDate = new Date(post.date).toUTCString();
    const tagsStr = (post.tags || []).map(t => `    <category>${t}</category>`).join('\n');
    return `    <item>
      <title><![CDATA[${post.title}]]></title>
      <link>${postUrl}</link>
      <guid isPermaLink="true">${postUrl}</guid>
      <pubDate>${pubDate}</pubDate>
      <description><![CDATA[${post.description}]]></description>
${tagsStr}
    </item>`;
}).join('\n');

const rssXml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>Abdulsamad Muyideen's Blog</title>
    <link>${BLOG_URL}</link>
    <description>Thoughts on cybersecurity, software engineering, and materials science.</description>
    <language>en-us</language>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
    <atom:link href="${SITE_URL}/rss.xml" rel="self" type="application/rss+xml"/>
${rssItems}
  </channel>
</rss>`;

fs.writeFileSync(rssOutput, rssXml);
console.log(`Built ${rssOutput}: ${blogEntries.length} items`);

// Update sitemap.xml with blog post URLs
const sitemapOutput = path.join(__dirname, '..', 'sitemap.xml');
const today = new Date().toISOString().split('T')[0];

const blogUrls = blogEntries.map(post => {
    const postUrl = `${SITE_URL}/blog.html?post=${post.slug}`;
    return `  <url>
    <loc>${postUrl}</loc>
    <lastmod>${today}</lastmod>
    <priority>0.6</priority>
  </url>`;
}).join('\n');

const sitemapXml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>${SITE_URL}/</loc>
    <lastmod>${today}</lastmod>
    <priority>1.0</priority>
  </url>
  <url>
    <loc>${SITE_URL}/blog.html</loc>
    <lastmod>${today}</lastmod>
    <priority>0.8</priority>
  </url>
  <url>
    <loc>${SITE_URL}/gallery.html</loc>
    <lastmod>${today}</lastmod>
    <priority>0.8</priority>
  </url>
  <url>
    <loc>${SITE_URL}/notebook.html</loc>
    <lastmod>${today}</lastmod>
    <priority>0.7</priority>
  </url>
${blogUrls}
</urlset>`;

fs.writeFileSync(sitemapOutput, sitemapXml);
console.log(`Built ${sitemapOutput}: ${blogEntries.length + 4} URLs`);
