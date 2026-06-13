/* ЄВРО КОМФОРТ — interactions */
(function () {
  'use strict';
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------- header scrolled state ---------- */
  var header = document.querySelector('.siteheader');
  function onScrollHeader() {
    if (window.scrollY > 40) header.classList.add('scrolled');
    else header.classList.remove('scrolled');
  }
  onScrollHeader();
  window.addEventListener('scroll', onScrollHeader, { passive: true });

  /* ---------- mobile nav overlay ---------- */
  var burger = document.querySelector('.burger');
  var mobnav = document.querySelector('.mobnav');
  var closeBtn = mobnav ? mobnav.querySelector('.close') : null;
  function setMenu(open) {
    if (!mobnav) return;
    mobnav.classList.toggle('open', open);
    if (!open) mobnav.classList.remove('subopen');
    document.body.style.overflow = open ? 'hidden' : '';
    if (burger) burger.setAttribute('aria-expanded', open ? 'true' : 'false');
  }
  /* catalog drill-in submenu */
  if (mobnav) {
    var subTrigger = mobnav.querySelector('.mobnav__trigger');
    var subBack = mobnav.querySelector('.mobback');
    if (subTrigger) subTrigger.addEventListener('click', function () { mobnav.classList.add('subopen'); });
    if (subBack) subBack.addEventListener('click', function () { mobnav.classList.remove('subopen'); });
  }
  /* desktop dropdown: aria + keyboard focus management (hover handled in CSS) */
  var dropNav = document.querySelector('.navitem.has-drop');
  if (dropNav) {
    var dropLink = dropNav.querySelector('.navlink');
    function setDrop(o) {
      dropNav.classList.toggle('open', o);
      if (dropLink) dropLink.setAttribute('aria-expanded', o ? 'true' : 'false');
    }
    dropNav.addEventListener('focusin', function () { setDrop(true); });
    dropNav.addEventListener('focusout', function (e) { if (!dropNav.contains(e.relatedTarget)) setDrop(false); });
    dropNav.addEventListener('mouseleave', function () { setDrop(false); });
  }
  if (burger) burger.addEventListener('click', function () { setMenu(true); });
  if (closeBtn) closeBtn.addEventListener('click', function () { setMenu(false); });
  if (mobnav) {
    mobnav.querySelectorAll('a[href^="#"]').forEach(function (a) {
      a.addEventListener('click', function () { setMenu(false); });
    });
  }

  /* ---------- smooth anchor scrolling (offset for fixed header) ---------- */
  document.querySelectorAll('a[href^="#"]').forEach(function (a) {
    a.addEventListener('click', function (e) {
      var id = a.getAttribute('href');
      if (id.length < 2) return;
      var target = document.querySelector(id);
      if (!target) return;
      e.preventDefault();
      var top = target.getBoundingClientRect().top + window.scrollY - 8;
      window.scrollTo({ top: top, behavior: reduce ? 'auto' : 'smooth' });
      history.replaceState(null, '', id);
    });
  });

  /* ---------- reveal on scroll (smooth, CSS-transition based) ----------
     Elements start hidden (.js .reveal) and get .in to transition in.
     If IntersectionObserver never fires (rare/headless), a watchdog
     force-reveals everything so content is never stuck hidden.        */
  var revealEls = Array.prototype.slice.call(document.querySelectorAll('.reveal, .reveal-line'));
  function show(el) { el.classList.add('in'); }
  function forceShow() {
    revealEls.forEach(function (el) {
      el.classList.add('in');
      var s = el.firstElementChild;
      // bypass any frozen transition in non-rendering contexts
      el.style.transition = 'none';
      if (el.classList.contains('reveal-line') && s) { s.style.transition = 'none'; s.style.transform = 'none'; }
      el.style.opacity = '1'; el.style.transform = 'none';
    });
  }
  if (reduce) {
    revealEls.forEach(show);
  } else if ('IntersectionObserver' in window) {
    var ioFired = false;
    var io = new IntersectionObserver(function (entries) {
      ioFired = true;
      entries.forEach(function (en) { if (en.isIntersecting) { show(en.target); io.unobserve(en.target); } });
    }, { threshold: 0.12, rootMargin: '0px 0px -10% 0px' });
    revealEls.forEach(function (el) { io.observe(el); });
    /* watchdog: if IO produced nothing (blocked/headless), reveal all */
    setTimeout(function () { if (!ioFired) forceShow(); }, 1800);
  } else {
    forceShow();
  }

  /* ---------- active nav + scroll spine ---------- */
  var navLinks = Array.prototype.slice.call(document.querySelectorAll('.mainnav a[href^="#"]'));
  var sections = navLinks.map(function (a) { return document.querySelector(a.getAttribute('href')); });
  var spineFill = document.querySelector('.spine .track i');
  var spinePct = document.querySelector('.spine .pct');
  function onScrollSpy() {
    var y = window.scrollY + window.innerHeight * 0.32;
    var current = -1;
    sections.forEach(function (s, i) { if (s && s.offsetTop <= y) current = i; });
    navLinks.forEach(function (a, i) { a.classList.toggle('active', i === current); });
    var doc = document.documentElement;
    var max = doc.scrollHeight - window.innerHeight;
    var p = max > 0 ? window.scrollY / max : 0;
    if (spineFill) spineFill.style.height = (p * 100).toFixed(1) + '%';
    if (spinePct) spinePct.textContent = String(Math.round(p * 100)).padStart(2, '0');
  }
  onScrollSpy();
  window.addEventListener('scroll', onScrollSpy, { passive: true });

  /* ---------- hero parallax (subtle) ---------- */
  var heroBg = document.querySelector('.hero__bg');
  if (heroBg && !reduce) {
    var ticking = false;
    window.addEventListener('scroll', function () {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(function () {
        var y = window.scrollY;
        if (y < window.innerHeight * 1.2) heroBg.style.transform = 'translateY(' + (y * 0.18).toFixed(1) + 'px)';
        ticking = false;
      });
    }, { passive: true });
  }

  /* ---------- FAQ accordion ---------- */
  document.querySelectorAll('.qa').forEach(function (qa) {
    var btn = qa.querySelector('.qa__q');
    var ans = qa.querySelector('.qa__a');
    btn.addEventListener('click', function () {
      var open = qa.classList.contains('open');
      document.querySelectorAll('.qa.open').forEach(function (o) {
        if (o !== qa) { o.classList.remove('open'); o.querySelector('.qa__a').style.maxHeight = null; o.querySelector('.qa__q').setAttribute('aria-expanded', 'false'); }
      });
      qa.classList.toggle('open', !open);
      btn.setAttribute('aria-expanded', !open ? 'true' : 'false');
      ans.style.maxHeight = !open ? ans.scrollHeight + 'px' : null;
    });
  });

  /* ---------- form: floating labels + fake submit ---------- */
  document.querySelectorAll('.field input, .field textarea').forEach(function (inp) {
    function sync() { inp.closest('.field').classList.toggle('filled', inp.value.trim() !== ''); }
    inp.addEventListener('input', sync); inp.addEventListener('blur', sync); sync();
  });
  document.querySelectorAll('.field select').forEach(function (sel) {
    function sync() { sel.closest('.field').classList.toggle('chosen', sel.value !== ''); }
    sel.addEventListener('change', sync); sync();
  });
  var form = document.querySelector('.form');
  if (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var ok = form.querySelector('.form__ok');
      var submit = form.querySelector('.form__submit');
      if (ok && submit) { submit.style.display = 'none'; ok.classList.add('show'); }
    });
  }

  /* ---------- touch devices: colorize media on scroll-into-view ---------- */
  if (window.matchMedia('(hover: none)').matches && 'IntersectionObserver' in window) {
    var touchEls = Array.prototype.slice.call(document.querySelectorAll('.tile, .slide:not(.is-ph)'));
    var tio = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) { en.target.classList.toggle('seen', en.isIntersecting); });
    }, { threshold: 0.55 });
    touchEls.forEach(function (el) { tio.observe(el); });
  }

  /* ---------- projects slider (drag + arrows + keyboard) ---------- */
  (function () {
    var slider = document.querySelector('.slider');
    if (!slider) return;
    var track = slider.querySelector('.slider__track');
    var prev = slider.querySelector('.slider__prev');
    var next = slider.querySelector('.slider__next');
    var progress = slider.querySelector('.slider__bar i');
    function step() {
      var first = track.querySelector('.slide');
      return first ? first.getBoundingClientRect().width + 24 : 360;
    }
    function update() {
      var max = track.scrollWidth - track.clientWidth;
      var p = max > 0 ? track.scrollLeft / max : 0;
      if (progress) progress.style.width = (8 + p * 92) + '%';
      if (prev) prev.disabled = track.scrollLeft < 4;
      if (next) next.disabled = track.scrollLeft > max - 4;
    }
    if (next) next.addEventListener('click', function () { track.scrollBy({ left: step(), behavior: 'smooth' }); });
    if (prev) prev.addEventListener('click', function () { track.scrollBy({ left: -step(), behavior: 'smooth' }); });
    track.addEventListener('scroll', update, { passive: true });
    /* pointer drag */
    var down = false, startX = 0, startL = 0, moved = false;
    track.addEventListener('pointerdown', function (e) {
      down = true; moved = false; startX = e.clientX; startL = track.scrollLeft;
      track.classList.add('dragging');
    });
    window.addEventListener('pointermove', function (e) {
      if (!down) return;
      var dx = e.clientX - startX;
      if (Math.abs(dx) > 4) moved = true;
      track.scrollLeft = startL - dx;
    });
    window.addEventListener('pointerup', function () { down = false; track.classList.remove('dragging'); });
    /* prevent click navigation right after a drag */
    track.querySelectorAll('a.slide').forEach(function (a) {
      a.addEventListener('click', function (e) { if (moved) e.preventDefault(); });
    });
    update();
    window.addEventListener('resize', update);
    window.addEventListener('load', update);
    setTimeout(update, 400);

    /* ---- infinite ping-pong auto-scroll ---- */
    if (!reduce) {
      var dir = 1;            // 1 = forward, -1 = back
      var speed = 0.6;        // px per frame
      var paused = false;
      var rafId = null;
      function tick() {
        rafId = requestAnimationFrame(tick);
        if (paused || down) return;
        var max = track.scrollWidth - track.clientWidth;
        if (max <= 0) return;
        var nl = track.scrollLeft + speed * dir;
        if (nl >= max) { nl = max; dir = -1; }
        else if (nl <= 0) { nl = 0; dir = 1; }
        track.scrollLeft = nl;
      }
      function pause() { paused = true; }
      function resume() { paused = false; }
      slider.addEventListener('pointerenter', pause);
      slider.addEventListener('pointerleave', resume);
      slider.addEventListener('pointerdown', pause);
      window.addEventListener('pointerup', function () { setTimeout(resume, 1200); });
      if (prev) prev.addEventListener('click', function () { pause(); setTimeout(resume, 2500); });
      if (next) next.addEventListener('click', function () { pause(); setTimeout(resume, 2500); });
      document.addEventListener('visibilitychange', function () { paused = document.hidden; });
      rafId = requestAnimationFrame(tick);
    }
  })();

  /* ---------- variants: interactive profile selector ---------- */
  (function () {
    var conf = document.querySelector('[data-variants]');
    if (!conf) return;
    var rows = Array.prototype.slice.call(conf.querySelectorAll('.vrow'));
    function activate(v) {
      conf.querySelectorAll('[data-v]').forEach(function (el) {
        var on = el.getAttribute('data-v') === v;
        el.classList.toggle('is-active', on);
        if (el.classList.contains('vrow')) el.setAttribute('aria-pressed', on ? 'true' : 'false');
      });
    }
    rows.forEach(function (r) {
      var v = r.getAttribute('data-v');
      r.addEventListener('click', function () { activate(v); });
      r.addEventListener('mouseenter', function () { activate(v); });
      r.addEventListener('focus', function () { activate(v); });
    });
  })();
})();
