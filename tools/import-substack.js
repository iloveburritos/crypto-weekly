// Imports Crypto Weekly issues from Substack that are newer than the latest post in ./posts.
// Usage: node tools/import-substack.js [--dry-run]
// Writes posts/MM-DD-YYYY.md and public/images/MM-DD-YYYY-1.png for each new issue.
const fs = require('fs');
const path = require('path');
const cheerio = require('cheerio');

const BASE = 'https://thisweekincrypto.substack.com';
const UA = 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0 Safari/537.36';
const postsDir = path.join(process.cwd(), 'posts');
const imagesDir = path.join(process.cwd(), 'public/images');
const dryRun = process.argv.includes('--dry-run');

const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July',
  'August', 'September', 'October', 'November', 'December'];
const pad = (n) => String(n).padStart(2, '0');

async function get(url) {
  const res = await fetch(url, { headers: { 'User-Agent': UA } });
  if (!res.ok) throw new Error(`${res.status} fetching ${url}`);
  return res;
}

// "MM-DD-YYYY" -> sortable number
const dateKey = (s) => { const [m, d, y] = s.split('-'); return Number(y + m + d); };

function latestLocalPost() {
  return fs.readdirSync(postsDir)
    .map((f) => f.match(/^(\d{2}-\d{2}-\d{4})\.md$/))
    .filter(Boolean)
    .map((m) => m[1])
    .sort((a, b) => dateKey(a) - dateKey(b))
    .pop();
}

// Title looks like "Crypto Weekly 10/18/26"
function parseTitleDate(title) {
  const m = title.match(/(\d{1,2})\/(\d{1,2})\/(\d{2,4})/);
  if (!m) return null;
  const year = m[3].length === 2 ? 2000 + Number(m[3]) : Number(m[3]);
  return { month: Number(m[1]), day: Number(m[2]), year };
}

function toMarkdown($) {
  const inline = (el) => $(el).contents().toArray().map((n) => {
    if (n.type === 'text') return $(n).text();
    const t = n.tagName;
    if (t === 'br') return '\n';
    if (t === 'a') return `[${$(n).text()}](${$(n).attr('href')})`;
    if (t === 'strong' || t === 'b') return `**${$(n).text()}**`;
    if (t === 'em' || t === 'i') return `*${$(n).text()}*`;
    return inline(n);
  }).join('');

  const blocks = [];
  const warnings = [];
  let imageUrl = null;
  $('div.available-content .body').children().each((i, el) => {
    const t = el.tagName;
    const e = $(el);
    if (t === 'h2' || t === 'h3') {
      blocks.push('---\n**' + e.clone().children().remove().end().text().trim() + '**');
    } else if (t === 'p') {
      const text = inline(el).trim();
      if (!text) return;
      if (/\bLink\s*$/.test(text) && !/\]\([^)]*\)\.?\s*$/.test(text)) {
        warnings.push(`Item has an unlinked "Link": ${text.slice(0, 80)}...`);
      }
      blocks.push(text.split('\n').map((l) => l.replace(/^- /, '\\- ').trimEnd()).join('\n'));
    } else if (e.find('figure').length || t === 'figure') {
      // Only one image per post
      if (imageUrl) return;
      const href = e.find('a.image-link').attr('href') || e.find('img').attr('src');
      const raw = href && href.split('/https%3A%2F%2F').pop();
      imageUrl = raw && raw !== href ? 'https://' + decodeURIComponent(raw) : href;
      blocks.push('IMAGE');
    } else if (t !== 'hr' && !e.find('hr').length) {
      warnings.push(`Skipped unhandled <${t}> block`);
    }
  });

  // Section headings sit directly above their first line, matching existing posts
  const body = blocks.join('\n\n').replace(/(---\n\*\*[^*\n]+\*\*)\n\n/g, '$1\n');
  return { body, imageUrl, warnings };
}

async function main() {
  const latest = latestLocalPost();
  console.log(`Latest local post: ${latest}`);

  const archive = await (await get(`${BASE}/archive?sort=new`)).text();
  const slugs = [...new Set(archive.match(/\/p\/crypto-weekly-[a-z0-9-]+/g) || [])];

  let imported = 0;
  for (const slug of slugs) {
    const html = await (await get(BASE + slug)).text();
    const $ = cheerio.load(html);
    const title = $('h1.post-title').first().text().trim();
    const d = parseTitleDate(title);
    if (!d) { console.warn(`Could not parse date from "${title}" (${slug}), skipping`); continue; }

    const name = `${pad(d.month)}-${pad(d.day)}-${d.year}`;
    if (dateKey(name) <= dateKey(latest)) continue;
    if (fs.existsSync(path.join(postsDir, `${name}.md`))) continue;

    const { body, imageUrl, warnings } = toMarkdown($);
    const md = [
      '---',
      `title: "Crypto Weekly ${name}"`,
      `date: "${name}"`,
      `longdate: "${MONTHS[d.month - 1]} ${d.day}, ${d.year}"`,
      '---',
      '',
      '*Crypto weekly is authored by [maaria bajwa](https://x.com/maariabajwa)*',
      '',
      body.replace('IMAGE', `![Image](/images/${name}-1.png)`),
      '',
    ].join('\n');

    console.log(`New issue: ${title} -> posts/${name}.md`);
    warnings.forEach((w) => console.warn(`  WARNING: ${w}`));
    if (!imageUrl) console.warn('  WARNING: no image found');

    if (!dryRun) {
      fs.writeFileSync(path.join(postsDir, `${name}.md`), md);
      if (imageUrl) {
        const res = await get(imageUrl);
        const type = res.headers.get('content-type') || '';
        if (!type.includes('png')) console.warn(`  WARNING: image is ${type}, saved as .png anyway`);
        fs.writeFileSync(path.join(imagesDir, `${name}-1.png`), Buffer.from(await res.arrayBuffer()));
      }
    }
    imported++;
  }
  console.log(imported ? `Imported ${imported} issue(s)${dryRun ? ' (dry run)' : ''}` : 'No new issues');
}

main().catch((err) => { console.error(err); process.exit(1); });
