# Bend FC × Juice Plus+ Healthy Starts booklet

A 24-page program information booklet. Finished size is 5.5 × 8.5 in, portrait, with no bleed. It is **REVIEW DRAFT** until every item in `audit/review-checklist.md` is resolved.

## Files

| File | What it is |
|---|---|
| `booklet.pdf` | **The booklet**: 24 pages in normal reading order, 5.5 × 8.5 in. Use this for FedEx Office and other print shops. |
| `booklet-home-print.pdf` | Imposed for printing at home or in the office: 12 US Letter landscape sides (6 sheets), two booklet pages per side. |
| `booklet.html`, `booklet.css` | Editable source (content and layout). |
| `build.mjs` | Builds the QR codes, `booklet.pdf` and `booklet-home-print.pdf`. |
| `impose-plan.mjs` | Saddle-stitch page order. |
| `qa.mjs` | Automated checks, previews and contact sheet; writes `qa-results.json`. |
| `qr/` | Vector QR codes (generated). |
| `previews/` | Page PNGs (110 dpi), spreads and `contact-sheet.png` (generated). |
| `audit/source-audit.md` | Every printed fact mapped to its source, plus image and QR inventory. |
| `audit/review-checklist.md` | Open questions (`[NEED FROM JAMES]`). |
| `QA-REPORT.md` | What was checked and the remaining limits. |

Images, logo and fonts are read from the site's own `../../images`, `../../assets` and `../../fonts` folders, so the booklet and website share one set of assets.

## Rebuild

Requirements:
- Node 18+.
- Chromium, which Playwright downloads with `npx playwright install chromium` if it isn't already present.
- For QA only: poppler-utils (`pdftoppm`, `pdffonts`, `pdfinfo`).

```sh
cd marketing/booklet
npm install
npm run build      # QR codes + booklet.pdf + booklet-home-print.pdf; exits non-zero on overflow
npm run qa         # checks + previews/ + qa-results.json
```

`npm run all` runs both. Expect one QA failure until higher-resolution photos are supplied: three images are below 300 ppi.

To edit:
1. Change the text in `booklet.html`.
2. Rebuild.
3. If the build reports `content overflows`, shorten that page.

Keep odd pages `recto` and even pages `verso`, and keep the page count divisible by 4. QR destinations live in `DESTINATIONS` in `build.mjs`.

## Printing at FedEx Office (recommended: saddle-stitched booklet)

1. Upload **`booklet.pdf`** (reading order). Don't upload the home-print file; FedEx arranges the pages itself.
2. Ask for:
   - **Booklet, saddle-stitched** (folded and stapled on the spine)
   - **Finished size 5.5 × 8.5 in**, printed on 8.5 × 11 in sheets folded in half
   - **Color, double-sided**
   - **24 pages**, which is 6 sheets per booklet
3. Paper: 80 lb or 100 lb gloss or matte text throughout. A heavier cover (for example 80–100 lb cover stock) is optional; at 24 pages, self-cover also works.
4. Bleed: none needed. The design keeps a white border, so no trimming to the edge is required.
5. Ask for **one proof copy first**. Check that page 3 faces page 2, the QR codes scan, and text clears the staples.

Alternative: a spiral or coil bound copy at 5.5 × 8.5 in also works from `booklet.pdf`. The inside margin is 0.62 in, which clears a coil. Saddle-stitch is cheaper and lies flatter for a handout this size.

Don't ask for "CMYK", "PDF/X" or "press-ready" output. This PDF is RGB and was not validated against PDF/X. FedEx converts RGB automatically. A commercial offset printer may ask for a CMYK conversion; tell them it is an RGB PDF with embedded fonts and no bleed.

## Printing at home (`booklet-home-print.pdf`)

1. Printer settings:
   - Paper: US Letter
   - Orientation: landscape
   - Scale: **100% / Actual size** (not "Fit")
   - Sides: two-sided, **flip on short edge**
2. Print all 12 sides. This gives 6 sheets.
3. Keep the sheets in the order they come out, sheet 1 on top. Sheet 1 front shows pages 24 | 1.
4. Fold the stack in half, with page 1 (the cover) facing out.
5. Staple twice on the fold.
6. Check that the pages run 1–24.

If your printer flips on the long edge, every back side will be upside down. Reprint with "short edge".

Expect a narrow white margin from the printer. The design has no edge-to-edge artwork, so nothing important is lost.
