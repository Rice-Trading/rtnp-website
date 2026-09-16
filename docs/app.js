/*
 * RTNP documentation — shell controller (product × language).
 * Loads docs/content/<product>/<lang>.html, injects it, and builds the sidebar
 * index from the <section> tags. Products & their available languages come from
 * products.js; language display names from languages.js. You should not need to
 * edit this file to add a language or a product.
 */
(function () {
  'use strict';
  var PRODUCTS = window.RTNP_PRODUCTS || [];
  var LANGS = window.RTNP_LANGS || [];
  var K_P = 'rtnp-docs-product', K_L = 'rtnp-docs-lang';
  var langByCode = {}, prodByCode = {};
  LANGS.forEach(function (l) { langByCode[l.code] = l; });
  PRODUCTS.forEach(function (p) { prodByCode[p.code] = p; });

  var $ = function (s, r) { return (r || document).querySelector(s); };
  var main = $('#main'), side = $('#side'), overlay = $('#langOverlay'), grid = $('#langGrid');
  var switchBtn = $('#switchLang'), prodSwitch = $('#productSwitch');
  var menuBtn = $('#menuBtn'), backdrop = $('#backdrop'), toTop = $('#toTop');
  var spy = null, cur = { product: null, lang: null };

  function prodLangs(pc) { var p = prodByCode[pc]; return (p && p.langs) || []; }
  function prodName(pc, lc) { var p = prodByCode[pc]; if (!p) return pc; return (p.name && (p.name[lc] || p.name.en)) || pc; }

  function jumpToHash() {
    if (!location.hash) return;
    var el = document.getElementById(location.hash.slice(1));
    if (el) el.scrollIntoView({ behavior: 'auto' });
  }

  /* ---------- initial state ---------- */
  function pickInitial() {
    var q = new URLSearchParams(location.search);
    var p = q.get('product'); if (!prodByCode[p]) p = null;
    if (!p) { try { p = localStorage.getItem(K_P); } catch (e) {} if (!prodByCode[p]) p = null; }
    if (!p) p = PRODUCTS[0] && PRODUCTS[0].code;   // default product

    var l = q.get('lang');
    if (!(l && prodLangs(p).indexOf(l) >= 0)) {
      try { l = localStorage.getItem(K_L); } catch (e) {}
    }
    if (!(l && prodLangs(p).indexOf(l) >= 0)) l = null;   // must be available for this product
    return { product: p, lang: l };
  }

  /* ---------- product switcher (top bar) ---------- */
  function buildProductSwitch() {
    prodSwitch.innerHTML = '';
    PRODUCTS.forEach(function (p) {
      var b = document.createElement('button');
      b.className = 'pseg-btn' + (p.code === cur.product ? ' active' : '');
      b.setAttribute('data-p', p.code);
      b.innerHTML = '<span class="pic">' + p.icon + '</span> ' + prodName(p.code, cur.lang || 'en');
      b.addEventListener('click', function () { setProduct(p.code); });
      prodSwitch.appendChild(b);
    });
  }

  function setProduct(pc) {
    if (pc === cur.product) return;
    var langs = prodLangs(pc);
    var lang = cur.lang && langs.indexOf(cur.lang) >= 0 ? cur.lang : (langs[0] || null);
    cur.product = pc;
    if (!lang) { cur.lang = null; buildProductSwitch(); openOverlay(); return; }
    applyState(pc, lang, true);
  }

  /* ---------- language picker ---------- */
  function buildPicker() {
    grid.innerHTML = '';
    var available = prodLangs(cur.product);
    LANGS.forEach(function (l) {
      var ok = available.indexOf(l.code) >= 0;
      var card = document.createElement(ok ? 'button' : 'div');
      card.className = 'lang-card' + (ok ? '' : ' soon') + (l.code === cur.lang ? ' active-lang' : '');
      card.setAttribute('lang', l.code);
      card.innerHTML = '<div class="endo">' + l.endonym + '</div><div class="eng" lang="en">' + l.english + '</div>' +
        (ok ? '' : '<span class="soonbadge" lang="en">soon</span>');
      if (ok) card.addEventListener('click', function () { applyState(cur.product, l.code, true); closeOverlay(); });
      grid.appendChild(card);
    });
    var sub = $('#langOverlaySub');
    if (sub) sub.textContent = prodName(cur.product, cur.lang || 'en') + ' · choose your language';
  }
  function openOverlay() { buildPicker(); overlay.classList.add('show'); }
  function closeOverlay() { if (cur.lang) overlay.classList.remove('show'); }

  /* ---------- apply product+lang ---------- */
  function applyState(product, lang, resetHash) {
    cur.product = product; cur.lang = lang;
    try { localStorage.setItem(K_P, product); localStorage.setItem(K_L, lang); } catch (e) {}
    document.documentElement.lang = lang;
    var u = new URLSearchParams(location.search);
    u.set('product', product); u.set('lang', lang);
    var hash = resetHash ? '' : location.hash;
    history.replaceState(null, '', location.pathname + '?' + u.toString() + hash);
    switchBtn.querySelector('.cur').textContent = (langByCode[lang] || {}).endonym || lang;
    buildProductSwitch();
    loadContent(product, lang);
  }

  /* ---------- content loading ---------- */
  function loadContent(product, lang) {
    main.innerHTML = '<div class="errbox"><p>…</p></div>';
    fetch('docs/content/' + product + '/' + lang + '.html', { cache: 'no-cache' })
      .then(function (r) { if (!r.ok) throw new Error(r.status); return r.text(); })
      .then(function (html) {
        main.innerHTML = html;
        var meta = $('#doc-meta', main);
        applyChrome(meta);
        buildSidebar(meta);
        setupSpy();
        if (location.hash) {
          jumpToHash();
          var imgs = main.querySelectorAll('img'), left = imgs.length;
          imgs.forEach(function (im) {
            if (im.complete) { if (--left === 0) jumpToHash(); return; }
            var done = function () { if (--left === 0) jumpToHash(); };
            im.addEventListener('load', done); im.addEventListener('error', done);
          });
        } else { window.scrollTo(0, 0); }
      })
      .catch(function () {
        main.innerHTML = '<div class="errbox"><h2>दस्तावेज़ लोड नहीं हो सका · Could not load</h2>' +
          '<p>यह पेज एक वेब-सर्वर से खुलना चाहिए (सीधे file:// से नहीं).<br>' +
          'Serve the folder, e.g. <code>python3 -m http.server</code>, then open it over http.</p></div>';
      });
  }

  function applyChrome(meta) {
    var d = meta ? meta.dataset : {};
    menuBtn.querySelector('.lbl').textContent = d.uiMenu || 'Menu';
    switchBtn.setAttribute('title', d.uiSwitch || 'Language');
    document.title = (d.uiTitle ? d.uiTitle + ' · ' : '') + 'RTNP';
  }

  /* ---------- sidebar built from the loaded sections ---------- */
  function buildSidebar(meta) {
    var d = meta ? meta.dataset : {};
    var html = '';
    if (d.uiFindhint) html += '<p class="findnote">' + d.uiFindhint + '</p>';
    var sections = main.querySelectorAll('section[id]');
    var groups = [], seen = {};
    sections.forEach(function (s) {
      var g = s.getAttribute('data-group') || '';
      if (!seen[g]) { seen[g] = []; groups.push(g); }
      seen[g].push(s);
    });
    groups.forEach(function (g) {
      if (g) html += '<h2>' + g + '</h2>';
      html += '<nav>';
      seen[g].forEach(function (s) {
        var label = s.getAttribute('data-nav') || s.id;
        var en = s.getAttribute('data-nav-en');
        html += '<a href="#' + s.id + '">' + label + (en ? ' <span class="en" lang="en">' + en + '</span>' : '') + '</a>';
      });
      html += '</nav>';
    });
    side.innerHTML = html;
  }

  /* ---------- scroll-spy ---------- */
  function setupSpy() {
    if (spy) spy.disconnect();
    var links = {};
    side.querySelectorAll('nav a').forEach(function (a) { links[a.getAttribute('href').slice(1)] = a; });
    spy = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) {
          side.querySelectorAll('nav a').forEach(function (a) { a.classList.remove('active'); });
          var a = links[en.target.id]; if (a) a.classList.add('active');
        }
      });
    }, { rootMargin: '-45% 0px -50% 0px' });
    main.querySelectorAll('section[id]').forEach(function (s) { spy.observe(s); });
  }

  /* ---------- global anchor clicks (sidebar + in-content) ---------- */
  document.addEventListener('click', function (e) {
    var a = e.target.closest('a[href^="#"]');
    if (!a) return;
    var el = document.getElementById(a.getAttribute('href').slice(1));
    if (!el) return;   // not an in-page anchor for the current content
    e.preventDefault();
    el.scrollIntoView({ behavior: 'smooth' });
    history.replaceState(null, '', location.pathname + location.search + a.getAttribute('href'));
    closeSide();
  });

  /* ---------- mobile drawer + back-to-top ---------- */
  function openSide() { side.classList.add('open'); backdrop.classList.add('show'); }
  function closeSide() { side.classList.remove('open'); backdrop.classList.remove('show'); }
  menuBtn.addEventListener('click', openSide);
  backdrop.addEventListener('click', closeSide);
  switchBtn.addEventListener('click', openOverlay);
  window.addEventListener('scroll', function () {
    if (window.scrollY > 500) toTop.classList.add('show'); else toTop.classList.remove('show');
  }, { passive: true });
  toTop.addEventListener('click', function () { window.scrollTo({ top: 0, behavior: 'smooth' }); });

  /* ---------- boot ---------- */
  var init = pickInitial();
  cur.product = init.product;
  buildProductSwitch();
  if (init.lang) { applyState(init.product, init.lang, false); }
  else { cur.lang = null; openOverlay(); }
})();
