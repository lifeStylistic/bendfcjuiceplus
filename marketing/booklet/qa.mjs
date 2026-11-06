// QA for the booklet. Run after build.mjs:  npm run qa
// Requires poppler-utils (pdftoppm, pdffonts, pdfinfo) on PATH.
// Writes previews/ (page PNGs, spreads, contact sheet) and qa-results.json.

import { PDFDocument, PDFName, PDFDict, PDFString, PDFHexString } from 'pdf-lib';
import sharp from 'sharp';
import jsQR from 'jsqr';
import { execFileSync } from 'node:child_process';
import { readFile, writeFile, mkdir, rm, readdir } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import os from 'node:os';
import { imposition } from './impose-plan.mjs';

const here = path.dirname(fileURLToPath(import.meta.url));
const out = (f) => path.join(here, f);
const results = { checks: [], pass: true };
const check = (name, ok, detail) => { results.checks.push({ name, ok, detail }); if (!ok) results.pass = false; console.log(`${ok ? 'PASS' : 'FAIL'}  ${name}${detail ? ' — ' + detail : ''}`); };

const report = JSON.parse(await readFile(out('build-report.json'), 'utf8'));
const pdfBytes = await readFile(out('booklet.pdf'));
const doc = await PDFDocument.load(pdfBytes);
const n = doc.getPageCount();

// 1. Page count and size
check('Page count is 24 and divisible by 4', n === 24 && n % 4 === 0, `${n} pages`);
const badSize = doc.getPages().map((p, i) => [i + 1, p.getWidth(), p.getHeight()]).filter(([, w, h]) => Math.abs(w - 396) > 0.5 || Math.abs(h - 612) > 0.5);
check('Every page is 5.5 x 8.5 in (396 x 612 pt)', badSize.length === 0, badSize.length ? JSON.stringify(badSize) : 'all pages');

// 2. Fonts embedded
const fonts = execFileSync('pdffonts', [out('booklet.pdf')]).toString().trim().split('\n').slice(2);
const notEmbedded = fonts.filter((l) => { const c = l.trim().split(/\s+/); return c[c.length - 5] !== 'yes'; });
check('All fonts embedded', notEmbedded.length === 0, `${fonts.length} font entries; families: ${[...new Set(fonts.map((l) => l.split(/\s+/)[0].replace(/^[A-Z]{6}\+/, '')))].join(', ')}`);

// 3. Layout report from the build
check('No text overflow / missing images (build report)', report.issues.length === 0, report.issues.join('; ') || 'none');
const lowRes = report.images.filter((i) => i.effectivePpi < 300);
check('Raster images at >= 300 effective ppi', lowRes.length === 0, lowRes.map((i) => `p${i.page} ${path.basename(i.src)} ${i.effectivePpi} ppi`).join('; ') || 'all');

// 4. Hyperlinks
const links = [];
doc.getPages().forEach((p, i) => {
  const arr = p.node.Annots ? p.node.Annots() : null;
  if (!arr) return;
  for (let k = 0; k < arr.size(); k++) {
    const a = arr.lookup(k, PDFDict);
    const act = a.lookupMaybe(PDFName.of('A'), PDFDict);
    const uri = act && act.lookupMaybe(PDFName.of('URI'), PDFString, PDFHexString);
    if (uri) links.push({ page: i + 1, uri: uri.decodeText() });
  }
});
const expected = ['https://us.juiceplus.com/pages/healthy-starts?partner=20292664#joinnow-form', 'https://us.juiceplus.com/pages/partner-application?partner=20292664', 'mailto:james.traynor@bendfctimbers.com', 'tel:+12069799792', 'https://pubmed.ncbi.nlm.nih.gov/20689455/'];
const missing = expected.filter((u) => !links.some((l) => l.uri === u));
check('Key hyperlinks present in PDF', missing.length === 0, `${links.length} link annotations; missing: ${missing.join(', ') || 'none'}`);
results.links = links;

// 5. Render pages: previews (110 dpi) and QR test renders (300 dpi)
const tmp = path.join(os.tmpdir(), 'booklet-qa');
await rm(tmp, { recursive: true, force: true }); await mkdir(tmp, { recursive: true });
await rm(out('previews'), { recursive: true, force: true }); await mkdir(out('previews'), { recursive: true });
execFileSync('pdftoppm', ['-r', '110', '-png', out('booklet.pdf'), out('previews/page')]);
const qrPages = [...new Set(report.qrs.map((q) => q.page))];
for (const pg of qrPages) execFileSync('pdftoppm', ['-r', '300', '-png', '-f', String(pg), '-l', String(pg), '-singlefile', out('booklet.pdf'), path.join(tmp, `q${pg}`)]);

// 6. Decode every QR occurrence from the rendered final PDF
const qrResults = [];
for (const q of report.qrs) {
  const pad = 0.12; // inches of surrounding page included in the crop
  const img = sharp(path.join(tmp, `q${q.page}.png`));
  const left = Math.max(0, Math.round((q.x - pad) * 300)), top = Math.max(0, Math.round((q.y - pad) * 300));
  const size = Math.round((q.w + 2 * pad) * 300);
  const { data, info } = await img.extract({ left, top, width: size, height: size }).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
  const r = jsQR(new Uint8ClampedArray(data), info.width, info.height);
  const want = report.destinations[q.name];
  qrResults.push({ ...q, decoded: r?.data ?? null, expected: want, sizeIn: q.w.toFixed(2), ok: r?.data === want });
}
results.qr = qrResults;
check(`All ${qrResults.length} QR codes decode to the intended URL from 300-dpi renders`, qrResults.every((r) => r.ok), qrResults.map((r) => `p${r.page} ${r.name} ${r.sizeIn}in ${r.ok ? 'ok' : 'GOT ' + r.decoded}`).join('; '));
check('QR codes at least 1 in square', qrResults.every((r) => r.w >= 0.99), qrResults.map((r) => `p${r.page} ${r.sizeIn}in`).join(', '));

// 7. Blank-page check (a page with almost no ink)
const blank = [];
for (const f of (await readdir(out('previews'))).filter((f) => f.startsWith('page-')).sort()) {
  const s = await sharp(out('previews/' + f)).greyscale().stats();
  if (s.channels[0].stdev < 4) blank.push(f);
}
check('No unexpected blank pages', blank.length === 0, blank.join(', ') || 'none');

// 8. Contact sheet and spreads
const pages = (await readdir(out('previews'))).filter((f) => f.startsWith('page-')).sort();
const meta = await sharp(out('previews/' + pages[0])).metadata();
const tw = Math.round(meta.width / 2.5), th = Math.round(meta.height / 2.5), gap = 14, cols = 8;
const thumbs = await Promise.all(pages.map((f) => sharp(out('previews/' + f)).resize(tw, th).toBuffer()));
await sharp({ create: { width: cols * (tw + gap) + gap, height: Math.ceil(n / cols) * (th + gap) + gap, channels: 3, background: '#7d8287' } })
  .composite(thumbs.map((b, i) => ({ input: b, left: gap + (i % cols) * (tw + gap), top: gap + Math.floor(i / cols) * (th + gap) }))).png().toFile(out('previews/contact-sheet.png'));
const spreads = [[1], ...Array.from({ length: (n - 2) / 2 }, (_, i) => [2 + 2 * i, 3 + 2 * i]), [n]];
for (const sp of spreads) {
  const imgs = await Promise.all(sp.map((p) => sharp(out(`previews/${pages[p - 1]}`)).toBuffer()));
  await sharp({ create: { width: meta.width * 2, height: meta.height, channels: 3, background: '#7d8287' } })
    .composite(imgs.map((b, i) => ({ input: b, left: (sp.length === 1 ? (sp[0] === 1 ? meta.width : 0) : i * meta.width), top: 0 }))).png()
    .toFile(out(`previews/spread-${sp.map((p) => String(p).padStart(2, '0')).join('-')}.png`));
}
check('Previews written', true, `${pages.length} pages, ${spreads.length} spreads, contact sheet`);

// 9. Imposition: each half of each imposed side must visually match the planned page
const imp = await PDFDocument.load(await readFile(out('booklet-home-print.pdf')));
const plan = imposition(n);
const sizesOk = imp.getPages().every((p) => Math.abs(p.getWidth() - 792) < 0.5 && Math.abs(p.getHeight() - 612) < 0.5);
execFileSync('pdftoppm', ['-r', '30', '-png', out('booklet-home-print.pdf'), path.join(tmp, 'imp')]);
execFileSync('pdftoppm', ['-r', '30', '-png', out('booklet.pdf'), path.join(tmp, 'ref')]);
const refFiles = (await readdir(tmp)).filter((f) => f.startsWith('ref-')).sort();
const impFiles = (await readdir(tmp)).filter((f) => f.startsWith('imp-')).sort();
const vec = async (buf) => (await sharp(buf).greyscale().resize(40, 62, { fit: 'fill' }).raw().toBuffer());
const refs = await Promise.all(refFiles.map((f) => vec(path.join(tmp, f))));
const diff = (a, b) => a.reduce((s, v, i) => s + Math.abs(v - b[i]), 0) / a.length;
const impErrors = [];
for (let s = 0; s < plan.length; s++) {
  const m = await sharp(path.join(tmp, impFiles[s])).metadata();
  for (const [half, want] of [['left', plan[s].left], ['right', plan[s].right]]) {
    const buf = await sharp(path.join(tmp, impFiles[s])).extract({ left: half === 'left' ? 0 : Math.floor(m.width / 2), top: 0, width: Math.floor(m.width / 2), height: m.height }).toBuffer();
    const v = await vec(buf);
    const scores = refs.map((r) => diff(v, r));
    const best = scores.indexOf(Math.min(...scores)) + 1;
    if (best !== want) impErrors.push(`sheet ${plan[s].sheet} ${plan[s].side} ${half}: expected p${want}, looks like p${best}`);
  }
}
// Simulated fold: stacking the sheets and reading in order must give 1..n.
const order = [];
const sheets = plan.length / 2;
for (let s = 0; s < sheets; s++) order.push(plan[2 * s].right, plan[2 * s + 1].left);
for (let s = sheets - 1; s >= 0; s--) order.push(plan[2 * s + 1].right, plan[2 * s].left);
const seqOk = order.every((p, i) => p === i + 1);
check('Home-print imposition: Letter landscape, page placement verified visually, fold order 1..N', sizesOk && impErrors.length === 0 && seqOk,
  `${imp.getPageCount()} sides; ${impErrors.join('; ') || 'all halves match'}; folded order ${seqOk ? 'correct' : order.join(',')}`);
results.imposition = plan;

await writeFile(out('qa-results.json'), JSON.stringify(results, null, 2));
console.log(results.pass ? '\nAll automated checks passed.' : '\nSome checks failed (see above).');
