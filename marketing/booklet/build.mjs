// Build the Healthy Starts booklet.
//   1. Generate vector QR codes (qr/*.svg) from DESTINATIONS.
//   2. Render booklet.html to booklet.pdf (5.5 x 8.5 in, reading order) with Chromium.
//   3. Impose booklet-home-print.pdf: saddle-stitch spreads on US Letter landscape.
// Usage: npm install && npm run build      (see README.md)

import { chromium } from 'playwright';
import QRCode from 'qrcode';
import { PDFDocument } from 'pdf-lib';
import { writeFile, readFile, mkdir } from 'node:fs/promises';
import { fileURLToPath, pathToFileURL } from 'node:url';
import path from 'node:path';
import { imposition } from './impose-plan.mjs';

const here = path.dirname(fileURLToPath(import.meta.url));
const out = (f) => path.join(here, f);

// Exact destinations, copied from index.html. Keep referral parameters intact.
const DESTINATIONS = {
  'healthy-starts': 'https://us.juiceplus.com/pages/healthy-starts?partner=20292664#joinnow-form',
  'partner': 'https://us.juiceplus.com/pages/partner-application?partner=20292664',
  'nutrition-gap-video': 'https://bendfc.youplusjuiceplus.com/presentation/video.the-solution-to-your-nutrition-gap?utm_campaign=juiceplus&utm_medium=shareCopy&utm_source=ios&utm_content=video_5938&utm_term=the-solution-to-your-nutrition-gap&utm_distributor=20292664',
  'how-to-video': 'https://bendfcjuiceplus.com/#how-to-enroll',
};

const PAGE_W = 5.5 * 72, PAGE_H = 8.5 * 72; // points

async function makeQRs() {
  await mkdir(out('qr'), { recursive: true });
  for (const [name, url] of Object.entries(DESTINATIONS)) {
    const svg = await QRCode.toString(url, {
      type: 'svg', errorCorrectionLevel: 'M', margin: 4, // 4-module quiet zone
      color: { dark: '#000000', light: '#ffffff' },
    });
    await writeFile(out(`qr/${name}.svg`), svg);
  }
}

async function renderPdf() {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  await page.goto(pathToFileURL(out('booklet.html')).href, { waitUntil: 'networkidle' });
  await page.evaluate(() => document.fonts.ready);
  await page.emulateMedia({ media: 'print' });

  // Layout checks: overflowing text frames, missing images, page count.
  const report = await page.evaluate(() => {
    const issues = [];
    const pages = [...document.querySelectorAll('.page')];
    pages.forEach((pg, i) => {
      const n = i + 1;
      if (Number(pg.dataset.page) !== n) issues.push(`page ${n}: data-page is ${pg.dataset.page}`);
      if (pg.classList.contains(n % 2 ? 'verso' : 'recto')) issues.push(`page ${n}: wrong recto/verso class`);
      pg.querySelectorAll('.inner, .panel').forEach((box) => {
        if (box.scrollHeight > box.clientHeight + 1) issues.push(`page ${n}: content overflows by ${box.scrollHeight - box.clientHeight}px`);
      });
      const pr = pg.getBoundingClientRect();
      pg.querySelectorAll('.inner *, .panel *').forEach((el) => {
        const r = el.getBoundingClientRect();
        if (r.width && (r.right > pr.right + 0.5 || r.left < pr.left - 0.5)) issues.push(`page ${n}: element sticks out horizontally (${el.tagName}.${el.className})`);
      });
    });
    document.querySelectorAll('img').forEach((img) => {
      if (!img.complete || !img.naturalWidth) issues.push(`missing image: ${img.getAttribute('src')}`);
    });
    // Effective resolution of raster images at printed size (CSS px are 1/96 in).
    const images = [...document.querySelectorAll('img')].filter((img) => !img.src.endsWith('.svg')).map((img) => {
      const r = img.getBoundingClientRect();
      const pageEl = img.closest('.page');
      // object-fit: cover crops, so the limiting axis is the larger scale factor.
      const scale = Math.max(r.width / img.naturalWidth, r.height / img.naturalHeight);
      const fit = getComputedStyle(img).objectFit;
      const s = fit === 'contain' ? Math.min(r.width / img.naturalWidth, r.height / img.naturalHeight) : scale;
      return { page: Number(pageEl.dataset.page), src: img.getAttribute('src'), natural: `${img.naturalWidth}x${img.naturalHeight}`,
        printedIn: `${(r.width / 96).toFixed(2)} x ${(r.height / 96).toFixed(2)}`, effectivePpi: Math.round(96 / s) };
    });
    // QR positions (inches from top-left of their page) for the QA decoder.
    const qrs = [...document.querySelectorAll('[data-qr] img')].map((img) => {
      const pg = img.closest('.page'); const pr = pg.getBoundingClientRect(); const r = img.getBoundingClientRect();
      return { page: Number(pg.dataset.page), name: img.closest('[data-qr]').dataset.qr,
        x: (r.left - pr.left) / 96, y: (r.top - pr.top) / 96, w: r.width / 96, h: r.height / 96 };
    });
    return { pageCount: pages.length, issues, images, qrs };
  });

  if (report.pageCount % 4) report.issues.push(`page count ${report.pageCount} is not divisible by 4`);
  await page.pdf({ path: out('booklet.pdf'), preferCSSPageSize: true, printBackground: true });
  await browser.close();

  // Document metadata.
  const doc = await PDFDocument.load(await readFile(out('booklet.pdf')));
  doc.setTitle('Bend FC × Juice Plus+ Healthy Starts — Program Booklet');
  doc.setAuthor('Bend FC');
  doc.setSubject('Healthy Starts program information booklet, 5.5 x 8.5 in, reading order');
  doc.setCreator('marketing/booklet/build.mjs (Chromium via Playwright)');
  await writeFile(out('booklet.pdf'), await doc.save());

  await writeFile(out('build-report.json'), JSON.stringify({ ...report, destinations: DESTINATIONS }, null, 2));
  return report;
}

async function impose() {
  const src = await PDFDocument.load(await readFile(out('booklet.pdf')));
  const n = src.getPageCount();
  const doc = await PDFDocument.create();
  const embedded = await doc.embedPdf(src, [...Array(n).keys()]);
  const W = 11 * 72, H = 8.5 * 72; // US Letter, landscape
  for (const s of imposition(n)) {
    const p = doc.addPage([W, H]);
    p.drawPage(embedded[s.left - 1], { x: 0, y: 0, width: PAGE_W, height: PAGE_H });
    p.drawPage(embedded[s.right - 1], { x: PAGE_W, y: 0, width: PAGE_W, height: PAGE_H });
  }
  doc.setTitle('Bend FC × Juice Plus+ Healthy Starts — HOME PRINT (imposed, US Letter, duplex flip on short edge)');
  doc.setCreator('marketing/booklet/build.mjs');
  await writeFile(out('booklet-home-print.pdf'), await doc.save());
  return imposition(n);
}

await makeQRs();
const report = await renderPdf();
const plan = await impose();
console.log(`booklet.pdf: ${report.pageCount} pages`);
console.log(`booklet-home-print.pdf: ${plan.length} Letter sides (${plan.length / 2} sheets)`);
for (const im of report.images) console.log(`  image p${im.page} ${im.src} ${im.natural} at ${im.printedIn} in -> ${im.effectivePpi} ppi`);
if (report.issues.length) { console.log('LAYOUT ISSUES:'); report.issues.forEach((i) => console.log('  - ' + i)); process.exitCode = 1; }
else console.log('Layout checks: no overflow, no missing images.');
