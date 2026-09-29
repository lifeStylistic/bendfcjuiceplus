/* Scroll-reveal + count-up animations for bendfcjuiceplus.com.
 *
 * Elements are tagged by selector below (no markup changes needed), fade or
 * slide in once as they scroll into view, and never re-hide. Pages load fully
 * visible if JS is off, IntersectionObserver is missing, or the visitor
 * prefers reduced motion.
 */
(function () {
  var root = document.documentElement;
  var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (reduce || !('IntersectionObserver' in window)) return;

  // [selector, effect, stagger]: stagger true delays by sibling position;
  // a number N staggers by position within each row of N (grid columns).
  var RULES = [
    // Home: hero
    ['.hero .eyebrow', 'up'],
    ['.hero-grid h1 span', 'up', true],
    ['.hero > .wrap > h1', 'up'],
    ['.hero .lead', 'up'],
    ['.hero-actions', 'up'],
    ['.hero .notice', 'up'],
    ['.hero-media .photo', 'right'],
    ['.hero-badge', 'zoom'],
    ['.stats .stat', 'up', true],

    // Home: video
    ['.video-layout > div:first-child', 'left'],
    ['.video-card', 'right'],

    // Shared section headings
    ['.section-head', 'up'],
    ['.toolbar > div:first-child', 'left'],
    ['.filters', 'right'],
    ['.legend', 'fade'],

    // Healthy Starts
    ['.steps .card', 'left', true],
    ['.glance', 'right'],
    ['.ages .age', 'up', true],
    ['.who', 'fade'],

    // Why Bend FC chose Juice Plus+
    ['.grid-4 > *', 'up', true],
    ['.why-quote', 'up'],

    // Impact
    ['.table-card', 'left'],
    ['.impact-layout > div:last-child', 'right'],
    ['.results .result', 'zoom', true],

    // Science
    ['.sci-stats .sci-stat', 'up', true],
    ['.grid-3 > *', 'up', true],
    ['.quote', 'zoom'],
    ['.timeline .tl', 'up', true],
    ['.timeline-caption', 'fade'],
    ['.studies', 'fade'],

    // Products
    ['.products-layout > div:first-child', 'left'],
    ['.products-layout > div:last-child', 'right'],

    // Partner
    ['.partner-top > div:first-child', 'left'],
    ['.partner-cta', 'right'],
    ['.perks .perk', 'up', true],
    ['.partner-faq', 'fade'],

    // FAQ
    ['.faq-layout > .accordion', 'left'],
    ['.resources', 'right'],

    // Closing CTA
    ['.cta-grid > div:first-child', 'left'],
    ['.contact-card', 'right'],

    // Athletes page
    ['.grid > .athlete', 'up', 3],
    ['.org-grid > .org', 'alternate', true],
    ['.callout > .is', 'left'],
    ['.callout > .isnt', 'right'],
    ['.table-wrap', 'up'],
    ['.method', 'fade']
  ];

  var STAGGER_MS = 90;
  var MAX_DELAY_MS = 540;

  function tag() {
    RULES.forEach(function (rule) {
      var els = document.querySelectorAll(rule[0]);
      Array.prototype.forEach.call(els, function (el) {
        if (el.hasAttribute('data-reveal')) return;
        var effect = rule[1];
        var index = 0;
        if (rule[2] && el.parentElement) {
          index = Array.prototype.indexOf.call(el.parentElement.children, el);
          if (typeof rule[2] === 'number') index = index % rule[2];
        }
        if (effect === 'alternate') effect = index % 2 ? 'right' : 'left';
        el.setAttribute('data-reveal', effect);
        if (index) el.style.setProperty('--reveal-delay', Math.min(index * STAGGER_MS, MAX_DELAY_MS) + 'ms');
      });
    });
  }

  // Count numbers up from zero, keeping any prefix/suffix ("$", "%", "+", "≈").
  var COUNT_SELECTORS = '.stats .stat strong, .big-pct strong, .results .result strong, .sci-stat strong';
  function prepCounters() {
    Array.prototype.forEach.call(document.querySelectorAll(COUNT_SELECTORS), function (el) {
      var text = el.textContent;
      var nums = text.match(/\d[\d,]*/g);
      if (!nums || nums.length !== 1) return; // skip ranges like "Ages 4–25"
      var m = text.match(/^(\D*)(\d[\d,]*)(\D*)$/);
      if (!m) return;
      el.setAttribute('data-count', m[2].replace(/,/g, ''));
      el.setAttribute('data-prefix', m[1]);
      el.setAttribute('data-suffix', m[3]);
      el.setAttribute('aria-label', text);
    });
  }
  function runCounter(el) {
    var target = parseInt(el.getAttribute('data-count'), 10);
    var prefix = el.getAttribute('data-prefix') || '';
    var suffix = el.getAttribute('data-suffix') || '';
    var start = null, duration = 1400;
    function frame(t) {
      if (start === null) start = t;
      var p = Math.min((t - start) / duration, 1);
      var eased = 1 - Math.pow(1 - p, 3);
      el.textContent = prefix + Math.round(target * eased).toLocaleString('en-US') + suffix;
      if (p < 1) requestAnimationFrame(frame);
    }
    el.textContent = prefix + '0' + suffix;
    requestAnimationFrame(frame);
  }

  root.classList.add('motion');
  tag();
  prepCounters();

  var io = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (!entry.isIntersecting) return;
      var el = entry.target;
      if (el.hasAttribute('data-reveal')) el.classList.add('is-in');
      if (el.hasAttribute('data-count')) runCounter(el);
      io.unobserve(el);
    });
  }, { rootMargin: '0px 0px -8% 0px', threshold: 0.12 });

  Array.prototype.forEach.call(document.querySelectorAll('[data-reveal], [data-count]'), function (el) {
    io.observe(el);
  });

  // Anything that is filtered/hidden and later shown (athlete filters) should just appear.
  document.addEventListener('click', function (e) {
    if (!e.target.closest || !e.target.closest('.filter')) return;
    Array.prototype.forEach.call(document.querySelectorAll('.athlete[data-reveal]'), function (el) {
      el.classList.add('is-in');
    });
  });
})();
