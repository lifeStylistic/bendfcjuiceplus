# Booklet source audit

Prepared November 4, 2026 for `marketing/booklet/booklet.html`. Every fact printed in the booklet is listed here with its source in this repository.

## Sources inspected

| Source | Status | Notes |
|---|---|---|
| `index.html` | **Live** (published on `main`) | Main source for program facts, FAQ, Partner FAQ, research summaries, contact details and links. |
| `athletes.html` | **Live** | Athlete and organization relationships and sources. Built from web-search extracts; the sources were never opened directly (see `research/athletes-research.md`). |
| `research/athletes-research.md` | Working notes | Records that direct page fetches were blocked, so all athlete claims are "pending direct read". |
| `infographic.html` (+ `downloads/`) | **Draft, not live** (open PR #10) | Source only for the planned Lunch & Learn classes, which came from James's own instructions. Its "20+ fruits" and "~90% renew" wording is **not** used. |
| `assets/flyer/…Flyer.pdf` / `.pptx` | Older Canva flyer, not linked from the site | Used only to cross-check. Conflicts are listed below. |
| `videos/how-to-enroll-healthy-starts.mp4` | **Live** (embedded on index.html) | The source for the 8 enrollment steps, the adult subscription prices and the billing language (frames read at 1920×1080). |
| `brochure.html`, `_redirects` | Redirect only | No content. |
| `css/motion.css`, `js/motion.js` | Website animation | Not relevant to print. |

## Content inventory

`index.html` line numbers refer to the file at commit 6ed9392.

| Topic | Source wording | Source and location | URL | Booklet page | Gaps / conflicts |
|---|---|---|---|---|---|
| Fundraiser identity | "A Bend FC fundraiser powered by The Juice Plus+ Company." | index.html:892 (footer) | — | 2, 23, 24 | — |
| Ages | "kids and young adults ages 4–25 receive Juice Plus+ at no product cost" | index.html:471 | — | 1, 2, 4, 5, 24 | Inclusive meaning of "25" not stated → checklist #4 |
| Free product condition | "The young person's product is free only when a qualifying adult purchases their own Healthy Starts subscription." | index.html:807 (FAQ) | — | 2, 5, 6, 20 | — |
| Handling fee | "$12 handling fee every four months per shipment" | index.html:488, 527, 553, 807 | — | 1, 2, 5, 6, 20, 24 | Flyer calls it a "promotional fee". Not visible in the video's checkout → #6 |
| Adult age | "Adult enrolls · Age 18+" | index.html:549, 803 | — | 4, 5 | — |
| Qualifying subscription | "Capsules, Chewables, or Superfood Powder" | index.html:523 | — | 4, 11 | Flyer p1: "Essentials Fruit & Vegetable Blends". Video: "Nutrition+ Powder" → #1 |
| Free product | "free Fruit & Vegetable Blend Capsules or Chewables to a loved one aged 4–25" | index.html:527 | — | 2, 5, 10, 11 | — |
| Shipping frequency | "Ships · Every 4 months"; "everything (adult and child) ships to one address" | index.html:552, 554, 811 | — | 5, 7, 20 | — |
| Ages → order type | "Childhood · 4–12 Child order (capsules or chewables)… Teen 13–18 Adult order (capsules)… Young adult 19–25 Adult order (capsules)" | index.html:563–565 | — | 5, 10, 11 | — |
| Who it's for | Parents, Grandparents, Aunts & Uncles, Coaches, Caregivers, Family friends | index.html:570 | — | 4 | Flyer omits Coaches |
| 3 steps | Subscribe / Gift it free / Build habits (optional surveys) | index.html:521–532 | — | 5 | — |
| Why Bend FC | "Daily habits, not game day…"; four pillars; "Together we're investing in healthier kids…" | index.html:579–589 | — | 3 | No "About Bend FC" text exists → #2 |
| 5% | "5% of every qualifying order goes back to Bend FC" | index.html:471, 623, 815 | — | 1, 2, 8, 9, 20, 24 | Stat strip (index.html:489) says "Of every order", without "qualifying" → booklet uses "qualifying" everywhere. Mechanism undocumented → #8 |
| Uses of funds | Scholarships, Player development, Fields & facilities, Club growth | index.html:625–628, 815 | — | 2, 9, 20 | Allocation and reporting not documented → #10 |
| Club example table | 25…1,500 adult orders; $103…$6,150/month; $1,230…$73,800/year | index.html:604–619 | — | 9 | Uses $82/month; the video shows $80.00 for the same product → #7 |
| Per-subscription | "Each $82/month subscription sends about $4.10 a month to Bend FC" | index.html:619 | — | 8 | Same as above |
| Example arithmetic | "1,500 orders × $82 = $123,000/month × 5% = $6,150/month = $73,800/year" | Flyer p2 | — | 9 | Consistent with the site table |
| Renewal claim | "about 90% renew each year" | index.html:632 | — | **Not used** | No source → #12 |
| Family-reported results | 89% / 66% / 60% | index.html:638–640; footnote ** index.html:894 | — | 15 | Survey source unknown → #14 |
| Research lead | "among the most thoroughly researched nutritional products of their kind…" | index.html:651 | — | 12 | Attributed to The Juice Plus+ Company |
| 40+ publications / 40+ institutions | index.html:655, 657 | — | — | 12, 20 | Attributed to The Juice Plus+ Company; unverified |
| ≈200 impact factor | index.html:656 | — | — | **Omitted** | Method and source not stated |
| 20 ingredients | "20 Fruits, vegetables & plant ingredients" | index.html:658 | — | 11 | "bioavailable in kids and adults" not printed (unsourced); infographic says 20+ → #16 |
| Exercise / oxidative stress | "randomized, placebo-controlled trial found reduced markers of oxidative stress after exercise in trained men and women" · MSSE | index.html:662, 692–699 | Study links, see references | 13, 21 | Which MSSE paper is meant is not stated |
| Immunity, cognition, lean mass, blood flow, cardio/DNA/Omega-3 | index.html:663–667 | — | — | 13 (held for review) | No specific citations → #17 |
| Timeline "When you'll feel it" | index.html:679–686 | — | — | **Omitted** | No data source; no chart made |
| DuBois quote + disclosure | index.html:671–675 | — | — | 13 | Approved by James (this conversation). Superlative claim → compliance review #18 |
| Products | 5 products with descriptors | index.html:719–723 | — | 11 | Serving directions absent → #15 |
| Product description | "whole-food nutrition from fruits, vegetables and berries, picked at peak ripeness and gently dried" | index.html:714 | — | 10 | — |
| "Bridge the gap" | "bridge the gap between what we should eat and what we actually do" | Flyer p1 | — | 10 | Used with an explicit "not a substitute" statement |
| Partner | lead, 3 cards, perks, 7 FAQs, $52/year | index.html:734–786 | partner-application URL | 18, 19 | Eligibility, comp plan and income disclosure → #19, #20 |
| Contact | James Traynor · james.traynor@bendfctimbers.com · 206-979-9792 | index.html:856–862 | mailto/tel | 7, 17, 23, 24 | — |
| Info vs. order sites | bendfcjuiceplus.com = information; bendfc.juiceplus.com = orders | James's instruction (this conversation); infographic.html | — | 17, 23 | — |
| Lunch & Learn | "planning multiple lunch and learn type classes with a nutritionist" | James's instruction; infographic.html (PR #10) | — | 9 | Details → #11 |
| Enrollment steps 1–8 | Visit shop / Open Healthy Starts / Join Now / Child's details + accept guidelines / Choose subscription / Free kids product matched to age / View Cart, FREE, Checkout / "You are shopping with Bend Fc" | how-to video, 0:08–1:38 | bendfc.juiceplus.com | 16, 17 | — |
| Adult prices | F&V Blend Capsules $54.00; F, V & Berry $80.00; F, V, Berry & Vegan Omega $112.50 | video, 0:44–0:56 (Healthy Starts form) | — | 6 | Capture date unknown. Powder price not legible → #5 |
| Billing | "Subscription, every 4 months"; "Billed 4 × $54.00/mo"; "Billing every 1 month / Delivery every 4 months"; "4 Monthly payments totals to $216.00"; "120 servings"; "Then $54.00/mo, ongoing"; "Remaining installments billed monthly, taxes at checkout"; "Shipping: calculated at checkout"; "This order has a recurring charge for multiple items" | video, 1:16–1:30 (cart/checkout) | — | 6, 7 | Child item also shows "4 Monthly payments totals to $108.00" next to FREE → #6 |
| Cancellation | "Change or cancel anytime" | video, 0:28 (Healthy Starts landing page) | — | 7 | Mid-cycle terms unknown → #9 |
| Athletes (9) + organizations (4) | Relationship text and status | athletes.html | Sources table | 14, 15, 22 | Not opened directly → #21 |
| FDA statement | Standard wording | index.html:894 | — | 10, 23, 24 | — |

## Image inventory

Effective ppi is measured by `build.mjs` at the final printed size.

| File | Pixels | Use in booklet | Printed size | Effective ppi | Suitability / rights |
|---|---|---|---|---|---|
| `images/team-huddle.jpg` | 1067×762 | Cover photo (grayscale) | 5.00 × 3.25 in | **213** | Below 300. Looks acceptable at 110-dpi preview, but expect visible softness. Source photographer and permission not recorded → #22 |
| `assets/bendfc-juiceplus-logo.png` | 2000×2000 (alpha) | Crest, cover and back cover | 1.01 in / 0.75 in | 1980 / 2667 | Excellent. No vector (SVG/PDF) version in the repo |
| `images/juiceplus-products.jpg` | 960×640 | Products page | 4.43 × 2.85 in | **217** | Below 300. Juice Plus+ company photo; print permission to confirm → #23 |
| `images/james-traynor.png` | 160×160 | Contact, page 23 | 0.80 in | **200** | Small headshot; acceptable at this size, a larger original is preferred |
| `images/crest-lockup.png` | 422×640 | Not used | — | — | The 2000-px asset is used instead |
| `images/how-to-enroll-poster.jpg`, `images/video-poster.jpg` | 1280×720 | Not used | — | — | Web video posters |
| `assets/healthy-starts-background.jpg` | 1920×1080 | Not used | — | — | Juice Plus+ branded background, not Bend FC |
| `assets/juiceplus-wordmark.png`, `assets/juiceplus-company-badge.png` | 738×246, 447×447 | Not used | — | — | The crest lockup already carries the Juice Plus+ wordmark |
| Flyer embedded images (e.g. 1400×1000 "Healthy Starts with you!") | — | Not used | — | — | Juice Plus+ marketing graphic with statistics not on the website |
| `qr/*.svg` | vector | QR codes | 1.0–1.3 in | vector | Generated by build.mjs |

No athlete images are used, because rights have not been secured (as stated on athletes.html).

## QR codes and links

| QR | Decoded destination | Matching site link | Used on |
|---|---|---|---|
| `images/qr-healthy-starts.png` (website) | `https://us.juiceplus.com/pages/healthy-starts?partner=20292664#joinnow-form` | Matches index.html:458, 473, 523, 557, 715, 849 | (website only) |
| `images/qr-partner.png` (website) | `https://us.juiceplus.com/pages/partner-application?partner=20292664` | Matches index.html:742 | (website only) |
| `images/qr-bendfc-store.png` (infographic) | `https://bendfc.juiceplus.com` | index.html:835, 862 | (not used in booklet) |
| `qr/healthy-starts.svg` (booklet, new vector) | Same as website Healthy Starts QR | — | p17, p24 |
| `qr/partner.svg` (booklet, new vector) | Same as website Partner QR | — | p19, p24 |

The booklet regenerates both QR codes as vector SVG, with error correction M and a 4-module quiet zone, from the exact URLs above. The partner parameter `partner=20292664` is preserved, and so is the `#joinnow-form` fragment.

**Live link test:** not possible. This environment's network proxy refused connections to us.juiceplus.com, bendfc.juiceplus.com, bendfcjuiceplus.com, pubmed.ncbi.nlm.nih.gov and cdn.shopify.com (HTTP 403 on CONNECT, Nov 4, 2026). Destination availability and redirects were **not** tested.

## Brand system (from the project)

- **Colors** (index.html `:root`): black `#0f1113`, ink `#15181b`, gold `#c6a15b` (print text uses the darker `#8a6a2c` for contrast), green `#4f9a2e`, green-dark `#2f5d1e`, sand `#f6f4ef`, gold-soft `#f5eddc`, green-soft `#eef5e8`.
- **Fonts:** Barlow (400/500/600/700) for body text and Barlow Condensed (700/800) for display, from the self-hosted `fonts/*.woff2` used by infographic.html. The Latin subset lacks `→ ≈ † …`, so the booklet avoids those characters.
- **Logo:** Bend FC × Juice Plus+ crest lockup (dark shield). On dark panels it always sits on a white tile, the same fix used for the website footer.
- **Image treatment:** the team photo is grayscale with a dark fade, as on the website and flyer. The product photo is shown in full color.
