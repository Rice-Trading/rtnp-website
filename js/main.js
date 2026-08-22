/* RTNP How-to Guide — progressive enhancements.
   Works without JS (this only adds niceties): theme toggle, scroll-spy TOC, back-to-top. */
(function () {
  "use strict";

  var root = document.documentElement;
  var STORE_KEY = "rtnp-theme"; // "light" | "dark" | absent (=auto/system)

  /* ---------- Theme ---------- */
  function applyTheme(mode) {
    if (mode === "light" || mode === "dark") {
      root.setAttribute("data-theme", mode);
    } else {
      root.removeAttribute("data-theme"); // fall back to prefers-color-scheme
    }
  }
  function storedTheme() {
    try { return localStorage.getItem(STORE_KEY); } catch (e) { return null; }
  }
  function storeTheme(mode) {
    try {
      if (mode) localStorage.setItem(STORE_KEY, mode);
      else localStorage.removeItem(STORE_KEY);
    } catch (e) {}
  }
  // Apply as early as possible.
  applyTheme(storedTheme());

  var THEME_CYCLE = [null, "light", "dark"]; // auto -> light -> dark -> auto
  var THEME_ICON = { "null": "◑", "light": "☀", "dark": "☾" };
  var THEME_LABEL = { "null": "थीम: ऑटो (सिस्टम)", "light": "थीम: लाइट", "dark": "थीम: डार्क" };

  function currentThemeKey() {
    var t = storedTheme();
    return t === "light" || t === "dark" ? t : "null";
  }

  /* ---------- Build floating controls ---------- */
  function makeButton(cls, label, html) {
    var b = document.createElement("button");
    b.type = "button";
    b.className = "fab " + cls;
    b.setAttribute("aria-label", label);
    b.title = label;
    b.innerHTML = html;
    return b;
  }

  /* ---------- Guide switch: Mobile app | Web portal ---------- */
  var VIEW_KEY = "rtnp-view"; // "mobile" | "web"

  function initViewSwitch() {
    var buttons = Array.prototype.slice.call(document.querySelectorAll(".seg-btn[data-view]"));
    var views = {
      mobile: document.getElementById("view-mobile"),
      web: document.getElementById("view-web")
    };
    if (!buttons.length || !views.mobile || !views.web) return;

    function storedView() {
      try { return localStorage.getItem(VIEW_KEY); } catch (e) { return null; }
    }
    function storeView(v) { try { localStorage.setItem(VIEW_KEY, v); } catch (e) {} }

    // Which view does an element id live in?
    function viewOfId(id) {
      var el = id && document.getElementById(id);
      if (!el) return null;
      var host = el.closest ? el.closest(".guide-view") : null;
      if (host === views.web) return "web";
      if (host === views.mobile) return "mobile";
      return null;
    }

    function showView(name, opts) {
      opts = opts || {};
      if (name !== "web") name = "mobile";
      Object.keys(views).forEach(function (k) {
        var on = k === name;
        views[k].classList.toggle("active", on);
        if (on) views[k].removeAttribute("hidden");
        else views[k].setAttribute("hidden", "");
      });
      buttons.forEach(function (b) {
        var on = b.getAttribute("data-view") === name;
        b.classList.toggle("active", on);
        b.setAttribute("aria-selected", on ? "true" : "false");
      });
      storeView(name);
      if (opts.scrollTop) window.scrollTo({ top: 0, behavior: opts.smooth ? "smooth" : "auto" });
    }

    // Initial view: URL hash target wins, then stored choice, then default (mobile).
    var hashId = (location.hash || "").replace(/^#/, "");
    var initial = viewOfId(hashId) || storedView() || "mobile";
    showView(initial);
    // If the hash points inside the (now visible) view, jump to it.
    if (hashId && viewOfId(hashId) === initial) {
      var t = document.getElementById(hashId);
      if (t) { try { t.scrollIntoView(); } catch (e) {} }
    }

    buttons.forEach(function (b) {
      b.addEventListener("click", function () {
        showView(b.getAttribute("data-view"), { scrollTop: true, smooth: true });
      });
    });

    // If someone follows a link to a section in the other view, switch first.
    window.addEventListener("hashchange", function () {
      var id = (location.hash || "").replace(/^#/, "");
      var v = viewOfId(id);
      if (v && !views[v].classList.contains("active")) {
        showView(v);
        var el = document.getElementById(id);
        if (el) { try { el.scrollIntoView(); } catch (e) {} }
      }
    });
  }

  function init() {
    initViewSwitch();

    var stack = document.createElement("div");
    stack.className = "fab-stack";

    // Theme toggle
    var themeBtn = makeButton("fab-theme", THEME_LABEL[currentThemeKey()], THEME_ICON[currentThemeKey()]);
    themeBtn.addEventListener("click", function () {
      var idx = THEME_CYCLE.indexOf(storedTheme() === "light" || storedTheme() === "dark" ? storedTheme() : null);
      var next = THEME_CYCLE[(idx + 1) % THEME_CYCLE.length];
      storeTheme(next);
      applyTheme(next);
      var key = next || "null";
      themeBtn.innerHTML = THEME_ICON[key];
      themeBtn.title = THEME_LABEL[key];
      themeBtn.setAttribute("aria-label", THEME_LABEL[key]);
    });
    stack.appendChild(themeBtn);

    // Back to top
    var topBtn = makeButton("fab-top", "ऊपर जाएँ · Back to top", "↑");
    topBtn.addEventListener("click", function () {
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
    stack.appendChild(topBtn);

    document.body.appendChild(stack);

    // Show back-to-top after some scrolling.
    var onScroll = function () {
      if (window.scrollY > 700) topBtn.classList.add("show");
      else topBtn.classList.remove("show");
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();

    /* ---------- Scroll-spy: highlight current section in the contents list ---------- */
    var links = Array.prototype.slice.call(document.querySelectorAll('.toc a[href^="#"]'));
    if (links.length && "IntersectionObserver" in window) {
      var byId = {};
      links.forEach(function (a) {
        var id = a.getAttribute("href").slice(1);
        if (id) byId[id] = a;
      });
      var sections = Object.keys(byId)
        .map(function (id) { return document.getElementById(id); })
        .filter(Boolean);

      var setActive = function (id) {
        links.forEach(function (a) { a.classList.remove("active"); });
        if (byId[id]) byId[id].classList.add("active");
      };

      var io = new IntersectionObserver(function (entries) {
        // Pick the entry nearest the top that is intersecting.
        var visible = entries
          .filter(function (e) { return e.isIntersecting; })
          .sort(function (a, b) { return a.boundingClientRect.top - b.boundingClientRect.top; });
        if (visible[0]) setActive(visible[0].target.id);
      }, { rootMargin: "-45% 0px -50% 0px", threshold: 0 });

      sections.forEach(function (s) { io.observe(s); });
    }
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
