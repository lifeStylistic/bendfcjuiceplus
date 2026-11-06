# QA report

Final run on November 6, 2026 with `npm run build && npm run qa`. Machine-readable results are in `qa-results.json`.

## Automated checks (`qa.mjs`)

| Check | Result | Detail |
|---|---|---|
| Page count 24, divisible by 4 | PASS | 24 pages |
| Page size | PASS | All pages 396 × 612 pt (5.5 × 8.5 in) |
| Fonts embedded | PASS | Barlow Regular/Medium/SemiBold/Bold and Barlow Condensed Bold/ExtraBold, all embedded and subset. No fallback fonts: the glyphs missing from the font subset (`→ ≈ † …`) were removed from the copy. The home-print PDF also has all fonts embedded. |
| Text overflow, missing images | PASS | `build.mjs` measures every page frame and stops on overflow |
| Raster images ≥ 300 effective ppi | **FAIL (accepted)** | Cover photo 213 ppi, product photo 217 ppi, headshot 200 ppi. James approved printing as is. |
| Hyperlinks | PASS | 42 link annotations, including the Healthy Starts and Partner forms, mailto, tel and the research links |
| QR decoding from the final PDF | PASS | Each page rendered at 300 dpi with `pdftoppm`; each of the 6 QR occurrences cropped and decoded with jsQR. p17 and p24 decode to the Healthy Starts join form (`…healthy-starts?partner=20292664#joinnow-form`); p19 and p24 decode to the Partner application (`…partner-application?partner=20292664`); p15 decodes to the "Solution to Your Nutrition Gap" video URL and to `https://bendfcjuiceplus.com/#how-to-enroll`. |
| QR size | PASS | 1.00–1.30 in (video codes 1.10 in), black on white, 4-module quiet zone, no photo underneath, all inside the margins and away from the gutter |
| Blank pages | PASS | None |
| Home-print imposition | PASS | 12 Letter landscape sides. Each half of each side was matched by image comparison to the page the plan says belongs there. The fold simulation reads 1–24 in order. |
| Previews | PASS | 24 page PNGs, 13 spreads, contact sheet |

## Full-bleed edition (`booklet-bleed.pdf`)

- 24 pages at 414 × 630 pt (5.75 × 8.75 in), with all six fonts embedded.
- All 6 QR codes decoded correctly from 300-dpi renders.
- Front and back covers checked against a drawn trim line: the artwork extends past the trim on all four sides, and text stays inside the safe area.
- No overflow (build check).
- The cover photo now prints at about 186 ppi (approved: print as is).

## Manual checks

- **Every page and spread inspected** at 110 dpi in `previews/`: 1, 2–3, 4–5, … 22–23, 24.
- **Fixed after inspection:**
  - A box color class clash made body text gold in tinted boxes.
  - The phone number wrapped across lines on page 7.
  - The athlete status labels were ambiguous.
  - Seven pages overflowed in the first build.
  - A fallback font was used for four symbols.
- **No clipped text, overlaps, distorted logos or bad crops found.** The crest always sits on a white tile on dark panels.
- **Type sizes:**
  - Body 10.5 pt; lead text 11.5 pt.
  - Tables 9–9.5 pt; captions and fine print 8.5–9 pt.
  - Reference URLs 8.2 pt, which is below the 9 pt target. They are a lookup aid and are clickable in the PDF.
  - The back-cover legal line is 7.5 pt.
- **Margins:** inside (binding) 0.62 in, outside 0.45 in, top 0.5 in, bottom 0.62 in. Covers are inset panels 0.25 in from the trim edge (no bleed).
- **Contrast:** gold text on white uses the darker `#8a6a2c`. The site's `#c6a15b` gold is used only on black.

## Content checks

- Every price, percentage, age, duration and fee was compared with `audit/source-audit.md`. Conditions sit beside the benefit they qualify: "free" always comes with "qualifying adult subscription" and "$12 per shipment".
- **Quotations:** only the DuBois quote, verbatim with its disclosure from index.html. There are no testimonials or quotes from Bend FC representatives.
- **Video codes:** the p15 video QR codes are labeled "Watch" and the page says to use p17 to enroll, so they can't be confused with the enrollment code.
- **FAQ coverage:** all 5 Healthy Starts FAQs (page 20) and all 7 Partner FAQs (page 19) appear with their answers unchanged. One FAQ was added ("Do I have to become a Partner?"), and its answer comes from the site's structure.
- **Calls to action:** Healthy Starts is primary (large green/white block, 1.3 in QR); Partner is secondary and labeled "Optional" (1.0 in QR) on pages 2, 17–19 and 24.
- **Open facts:** James answered every review question on Nov 6, 2026 (`audit/review-checklist.md`). No draft markers remain, and the athletes pages were removed at his request.

## Could not be done

- **Live link and redirect testing:** blocked. The network proxy refused us.juiceplus.com, bendfc.juiceplus.com, bendfcjuiceplus.com, pubmed and cdn.shopify.com. No enrollment or application was attempted.
- **Reading the research papers and athlete sources:** blocked for the same reason. A cloud environment named `bendfcjuiceplus` that allows these hosts now exists for future sessions. Research findings are limited to what the website states. Unsourced topics are held for review rather than presented.
- **Physical print proof:** not possible here. Get one proof copy before a full run.
- **CMYK / PDF/X:** not produced or validated. The PDF is RGB.
