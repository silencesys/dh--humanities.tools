// pages/api/screenshot.js
import crypto from 'crypto';
import sharp from 'sharp';
import { put, head } from '@vercel/blob';

function ensureProtocol(input) {
  return /^[a-z][a-z0-9+.-]*:\/\//i.test(input) ? input : 'http://' + input;
}

function normalizePathname(p) {
  if (!p) return '/';
  const parts = [];
  for (const seg of p.split('/')) {
    if (seg === '' || seg === '.') continue;
    if (seg === '..') { parts.pop(); continue; }
    parts.push(seg);
  }
  let out = '/' + parts.join('/');
  if (out.length > 1 && out.endsWith('/')) out = out.slice(0, -1);
  return out;
}

function sortSearchParams(searchParams) {
  const entries = [];
  for (const [k, v] of searchParams.entries()) entries.push([k, v]);
  entries.sort((a, b) => (a[0] === b[0] ? (a[1] < b[1] ? -1 : a[1] > b[1] ? 1 : 0) : (a[0] < b[0] ? -1 : 1)));
  const sp = new URLSearchParams();
  for (const [k, v] of entries) sp.append(k, v);
  return sp.toString();
}

function canonicalizeUrl(inputUrl) {
  const u = new URL(ensureProtocol(inputUrl));
  const protocol = u.protocol.toLowerCase();
  const hostname = u.hostname.toLowerCase();
  let port = u.port;
  if ((protocol === 'http:' && port === '80') || (protocol === 'https:' && port === '443')) port = '';
  const pathname = normalizePathname(u.pathname);
  const query = sortSearchParams(u.searchParams);
  const hash = u.hash || ''; // keep fragment

  let out = `${protocol}//${hostname}`;
  if (port) out += `:${port}`;
  out += pathname;
  if (query) out += `?${query}`;
  if (hash) out += hash;
  return out;
}

function safeName(input) {
  return (input || '').toString().toLowerCase()
    .replace(/[^a-z0-9]+/g, '_').replace(/^_+|_+$/g, '').slice(0, 60);
}

function hashHex(str, bytes = 16) {
  return crypto.createHash('sha256').update(str).digest('hex').slice(0, bytes * 2);
}

function fileKeyFor(inputUrl, size) {
  const u = new URL(ensureProtocol(inputUrl));
  const host = safeName(u.hostname);
  const id = hashHex(canonicalizeUrl(inputUrl), 16);
  const lastSeg = u.pathname.split('/').filter(Boolean).pop() || 'root';
  const frag = u.hash ? u.hash.slice(1) : '';
  const slug = safeName(lastSeg + (frag ? '_' + frag : '')) || 'page';
  const variant = size ? `_w${size.w}h${size.h}` : '';
  // Flat namespace (no folders)
  return `${host}__${id}_${slug}${variant}.png`;
}

function parseSize(req) {
  const w = parseInt(req.query.w, 10);
  const h = parseInt(req.query.h, 10);
  if (Number.isFinite(w) && Number.isFinite(h) && w > 0 && h > 0) return { w, h };
  return null;
}

export default async function handler(req, res) {
  const target = req.query.url || '';
  const size = parseSize(req);

  if (!target) {
    res.status(400).json({ error: 'Missing url' });
    return;
  }

  const key = fileKeyFor(target, size);

  // If already uploaded, redirect to the public URL
  try {
    const meta = await head(key);
    if (meta && meta.url) {
      res.status(302).setHeader('Location', meta.url).end();
      return;
    }
  } catch {
    // head() throws if not found; we proceed to generate
  }

  // Launch Puppeteer (use puppeteer-core + @sparticuz/chromium on Vercel)
  let browser;
  try {
    if (process.env.VERCEL) {
      const chromium = await import('@sparticuz/chromium');
      const puppeteerCore = await import('puppeteer-core');
      browser = await puppeteerCore.default.launch({
        args: chromium.default.args,
        executablePath: await chromium.default.executablePath(),
        headless: true,
      });
    } else {
      const puppeteer = await import('puppeteer');
      browser = await puppeteer.default.launch({ headless: true });
    }

    const page = await browser.newPage();
    await page.setViewport({ width: 1260, height: 990 }); // 14:11

    await page.evaluateOnNewDocument(() => {
      try { history.scrollRestoration = 'manual'; } catch {}
      const style = document.createElement('style');
      style.textContent = 'html,body{scroll-behavior:auto !important;}';
      document.documentElement.appendChild(style);
      window.addEventListener('load', () => {
        window.scrollTo(0, 0);
        document.documentElement.scrollTop = 0;
        document.body.scrollTop = 0;
      }, { once: true });
    });

    await page.goto(ensureProtocol(target), { waitUntil: 'networkidle2', timeout: 60_000 });

    await page.evaluate(() => {
      window.scrollTo(0, 0);
      document.documentElement.scrollTop = 0;
      document.body.scrollTop = 0;
    });

    // 5) Ensure we’re there
    await page.waitForFunction(() => window.scrollY === 0);

    // Full page capture; remove fullPage if you only want viewport
    const originalBuffer = await page.screenshot({ type: 'png', fullPage: true });

    let resultBuffer = originalBuffer;
    if (size) {
      resultBuffer = await sharp(originalBuffer)
        .resize(size.w, size.h, {
          fit: 'cover',       // or 'contain' to letterbox instead of crop
          position: 'center',
          withoutEnlargement: true,
        })
        .png()
        .toBuffer();
    }

    // Upload to Vercel Blob (public)
    const { url } = await put(key, resultBuffer, {
      access: 'public',
      contentType: 'image/png',
      cacheControl: 'public, max-age=31536000, immutable',
      addRandomSuffix: false, // keep deterministic key
    });

    // Redirect to the Blob URL
    res.status(302).setHeader('Location', url).end();
  } finally {
    if (browser) await browser.close();
  }
}
