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
  const variant = size ? `_w${size.w}h${size.h}` : '';
  // Flat namespace (no folders), include size variant to avoid overwrites
  return `${host}_${id}${variant}.png`;
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
    // head() throws if not found; proceed to generate
  }

  // Launch Puppeteer (Vercel: puppeteer-core + @sparticuz/chromium + stealth)
  let browser;
  try {
    const UA =
      'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36';

    if (process.env.VERCEL) {
      const chromium = (await import('@sparticuz/chromium')).default;
      const { addExtra } = await import('puppeteer-extra');
      const StealthPlugin = (await import('puppeteer-extra-plugin-stealth')).default;
      const puppeteerCore = (await import('puppeteer-core')).default;

      const puppeteer = addExtra(puppeteerCore);
      puppeteer.use(StealthPlugin());

      browser = await puppeteer.launch({
        args: [
          ...chromium.args,
          '--disable-dev-shm-usage',
          '--no-first-run',
          '--no-default-browser-check',
          '--ignore-gpu-blocklist',
          '--enable-webgl',
          '--use-gl=swiftshader',
          '--hide-scrollbars',
          '--window-size=1260,990',
        ],
        defaultViewport: { width: 1260, height: 990, deviceScaleFactor: 2 },
        executablePath: await chromium.executablePath(),
        headless: true,
      });
    } else {
      const { addExtra } = await import('puppeteer-extra');
      const StealthPlugin = (await import('puppeteer-extra-plugin-stealth')).default;
      const puppeteer = addExtra((await import('puppeteer')).default);
      puppeteer.use(StealthPlugin());

      browser = await puppeteer.launch({
        headless: true,
        defaultViewport: { width: 1260, height: 990, deviceScaleFactor: 2 },
        args: ['--hide-scrollbars', '--window-size=1260,990'],
      });
    }

    const page = await browser.newPage();

    // Language and UA
    await page.setUserAgent(UA);
    await page.setExtraHTTPHeaders({
      'Accept-Language': 'en-US,en;q=0.9,cs;q=0.8',
      'sec-ch-ua': '"Google Chrome";v="126", "Chromium";v="126", "Not=A?Brand";v="99"',
      'sec-ch-ua-platform': '"Windows"',
      'sec-ch-ua-mobile': '?0',
    });

    // Timezone + media features
    await page.emulateTimezone('Europe/Prague');
    await page.emulateMediaType('screen');
    await page.emulateMediaFeatures([
      { name: 'prefers-color-scheme', value: 'light' },
      { name: 'prefers-reduced-motion', value: 'no-preference' },
    ]);

    // Start at the top; disable smooth scrolling and scroll restoration
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

    // Strip hash to avoid auto-jump to anchors
    const urlObj = new URL(ensureProtocol(target));
    urlObj.hash = '';

    await page.goto(urlObj.toString(), { waitUntil: 'networkidle2', timeout: 60_000 });

    // Optional: auto-scroll to trigger lazy content, then return to top
    async function autoScroll(p) {
      await p.evaluate(async () => {
        await new Promise((resolve) => {
          let total = 0;
          const distance = Math.max(200, Math.floor(window.innerHeight * 0.6));
          const timer = setInterval(() => {
            const doc = document.scrollingElement || document.documentElement;
            const max = doc.scrollHeight - window.innerHeight;
            window.scrollBy(0, distance);
            total += distance;
            if (total >= max - 2) {
              clearInterval(timer);
              resolve();
            }
          }, 80);
        });
      });
    }
    await autoScroll(page);
    await page.evaluate(() => {
      window.scrollTo(0, 0);
      document.documentElement.scrollTop = 0;
      document.body.scrollTop = 0;
    });
    await page.waitForFunction(() => window.scrollY === 0);

    // Viewport-only capture (top of page); set fullPage: true if you want full-length
    const originalBuffer = await page.screenshot({ type: 'png', fullPage: false });

    let resultBuffer = originalBuffer;
    if (size) {
      resultBuffer = await sharp(originalBuffer)
        .resize(size.w, size.h, {
          fit: 'cover',         // or 'contain' to letterbox
          position: 'center',   // or 'northwest' for top-left crop
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
      addRandomSuffix: false, // deterministic key
    });

    // Redirect to the Blob URL
    res.status(302).setHeader('Location', url).end();
  } finally {
    if (browser) await browser.close();
  }
}
