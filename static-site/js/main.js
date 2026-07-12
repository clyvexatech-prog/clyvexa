/* ===== GLYVEXA — Advanced UI JS ===== */

/* --- Splash Screen --- */
(function() {
  var splash = document.getElementById('splash-screen');
  if (!splash) return;
  var shown = sessionStorage.getItem('glyvexa-splash');
  if (shown) { splash.style.display = 'none'; return; }
  setTimeout(function() {
    splash.classList.add('hide');
    sessionStorage.setItem('glyvexa-splash', '1');
    setTimeout(function() { splash.style.display = 'none'; }, 1000);
  }, 5000);
})();

/* --- Particles --- */
(function() {
  var canvas = document.getElementById('particles');
  if (!canvas) return;
  var ctx = canvas.getContext('2d');
  var particles = [];
  var count = window.innerWidth < 768 ? 30 : 60;

  function resize() { canvas.width = window.innerWidth; canvas.height = window.innerHeight; }
  resize();
  window.addEventListener('resize', resize);

  function Particle() {
    this.x = Math.random() * canvas.width;
    this.y = Math.random() * canvas.height;
    this.vx = (Math.random() - 0.5) * 0.3;
    this.vy = (Math.random() - 0.5) * 0.3;
    this.r = Math.random() * 2 + 0.5;
    this.alpha = Math.random() * 0.3 + 0.1;
  }
  for (var i = 0; i < count; i++) particles.push(new Particle());

  function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    var isDark = document.documentElement.getAttribute('data-theme') === 'dark';
    var color = isDark ? '59,130,246' : '59,130,246';
    for (var i = 0; i < particles.length; i++) {
      var p = particles[i];
      p.x += p.vx; p.y += p.vy;
      if (p.x < 0 || p.x > canvas.width) p.vx *= -1;
      if (p.y < 0 || p.y > canvas.height) p.vy *= -1;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(' + color + ',' + p.alpha + ')';
      ctx.fill();
      for (var j = i + 1; j < particles.length; j++) {
        var p2 = particles[j];
        var dx = p.x - p2.x, dy = p.y - p2.y;
        var dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 120) {
          ctx.beginPath();
          ctx.moveTo(p.x, p.y);
          ctx.lineTo(p2.x, p2.y);
          ctx.strokeStyle = 'rgba(' + color + ',' + (0.08 * (1 - dist / 120)) + ')';
          ctx.lineWidth = 0.5;
          ctx.stroke();
        }
      }
    }
    requestAnimationFrame(draw);
  }
  draw();
})();

/* --- Custom Cursor --- */
(function() {
  if (window.innerWidth < 768) return;
  var dot = document.createElement('div');
  dot.className = 'cursor-dot';
  var ring = document.createElement('div');
  ring.className = 'cursor-ring';
  document.body.appendChild(dot);
  document.body.appendChild(ring);

  var mx = 0, my = 0, rx = 0, ry = 0;
  document.addEventListener('mousemove', function(e) {
    mx = e.clientX; my = e.clientY;
    dot.style.transform = 'translate(' + mx + 'px,' + my + 'px) translate(-50%,-50%)';
  });

  function animRing() {
    rx += (mx - rx) * 0.15;
    ry += (my - ry) * 0.15;
    ring.style.left = rx + 'px';
    ring.style.top = ry + 'px';
    requestAnimationFrame(animRing);
  }
  animRing();

  var hoverEls = document.querySelectorAll('a, button, .card, .btn');
  hoverEls.forEach(function(el) {
    el.addEventListener('mouseenter', function() { ring.classList.add('hover'); dot.style.transform += ' scale(1.5)'; });
    el.addEventListener('mouseleave', function() { ring.classList.remove('hover'); });
  });
})();

/* --- Mobile Nav --- */
document.addEventListener('DOMContentLoaded', function() {
  var toggle = document.getElementById('mobile-toggle');
  var menu = document.getElementById('mobile-menu');
  if (toggle && menu) {
    toggle.addEventListener('click', function() {
      menu.classList.toggle('open');
      toggle.textContent = menu.classList.contains('open') ? '\u2715' : '\u2630';
    });
    menu.querySelectorAll('a').forEach(function(a) {
      a.addEventListener('click', function() {
        menu.classList.remove('open');
        toggle.textContent = '\u2630';
      });
    });
  }

  /* --- Theme Toggle --- */
  var themeBtn = document.getElementById('theme-toggle');
  var html = document.documentElement;
  var stored = localStorage.getItem('glyvexa-theme');
  if (stored) html.setAttribute('data-theme', stored);
  else if (window.matchMedia('(prefers-color-scheme: dark)').matches) html.setAttribute('data-theme', 'dark');

  function updateThemeIcon() {
    if (!themeBtn) return;
    themeBtn.textContent = html.getAttribute('data-theme') === 'dark' ? '\u2600' : '\u263E';
  }
  updateThemeIcon();

  if (themeBtn) {
    themeBtn.addEventListener('click', function() {
      var current = html.getAttribute('data-theme');
      var next = current === 'dark' ? 'light' : 'dark';
      html.setAttribute('data-theme', next);
      localStorage.setItem('glyvexa-theme', next);
      updateThemeIcon();
    });
  }

  /* --- Scroll Animations --- */
  var animateEls = document.querySelectorAll('.animate, .animate-left, .animate-right, .animate-scale');
  if ('IntersectionObserver' in window && animateEls.length) {
    var observer = new IntersectionObserver(function(entries) {
      entries.forEach(function(entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.08, rootMargin: '0px 0px -40px 0px' });
    animateEls.forEach(function(el) { observer.observe(el); });
  } else {
    animateEls.forEach(function(el) { el.classList.add('visible'); });
  }

  /* --- Rotating Hero Text --- */
  var rotatingEl = document.getElementById('rotating-text');
  if (rotatingEl) {
    var texts = ['Starting Our Journey', 'Building Solutions', 'Learning & Growing', 'Ready to Help'];
    var idx = 0;
    setInterval(function() {
      rotatingEl.style.opacity = '0';
      rotatingEl.style.transform = 'translateY(10px)';
      setTimeout(function() {
        idx = (idx + 1) % texts.length;
        rotatingEl.textContent = texts[idx];
        rotatingEl.style.opacity = '1';
        rotatingEl.style.transform = 'translateY(0)';
      }, 350);
    }, 3000);
  }

  /* --- Stat Counter --- */
  var statNums = document.querySelectorAll('[data-count]');
  if ('IntersectionObserver' in window && statNums.length) {
    var statObs = new IntersectionObserver(function(entries) {
      entries.forEach(function(entry) {
        if (entry.isIntersecting) {
          var el = entry.target;
          var target = parseInt(el.getAttribute('data-count'), 10);
          var suffix = el.getAttribute('data-suffix') || '';
          var duration = 2000;
          var startTime = null;
          function step(ts) {
            if (!startTime) startTime = ts;
            var progress = Math.min((ts - startTime) / duration, 1);
            var eased = 1 - Math.pow(1 - progress, 3);
            el.textContent = Math.floor(eased * target) + suffix;
            if (progress < 1) requestAnimationFrame(step);
            else el.textContent = target + suffix;
          }
          requestAnimationFrame(step);
          statObs.unobserve(el);
        }
      });
    }, { threshold: 0.3 });
    statNums.forEach(function(el) { statObs.observe(el); });
  }

  /* --- 3D Tilt on Cards --- */
  if (window.innerWidth > 768) {
    var cards = document.querySelectorAll('.card, .value-card, .stat-card, .mission-card, .contact-card, .faq-item, .team-card');
    cards.forEach(function(card) {
      card.addEventListener('mousemove', function(e) {
        var rect = card.getBoundingClientRect();
        var x = e.clientX - rect.left;
        var y = e.clientY - rect.top;
        var centerX = rect.width / 2;
        var centerY = rect.height / 2;
        var rotateX = (y - centerY) / centerY * -5;
        var rotateY = (x - centerX) / centerX * 5;
        card.style.transform = 'perspective(1000px) rotateX(' + rotateX + 'deg) rotateY(' + rotateY + 'deg) translateY(-8px)';
      });
      card.addEventListener('mouseleave', function() {
        card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) translateY(0)';
      });
    });
  }

  /* --- Magnetic Buttons --- */
  if (window.innerWidth > 768) {
    var magneticEls = document.querySelectorAll('.btn, .theme-toggle, .footer-social a');
    magneticEls.forEach(function(el) {
      el.addEventListener('mousemove', function(e) {
        var rect = el.getBoundingClientRect();
        var x = e.clientX - rect.left - rect.width / 2;
        var y = e.clientY - rect.top - rect.height / 2;
        el.style.transform = 'translate(' + (x * 0.2) + 'px,' + (y * 0.2) + 'px)';
      });
      el.addEventListener('mouseleave', function() {
        el.style.transform = 'translate(0,0)';
      });
    });
  }

  /* --- Active Nav --- */
  var path = window.location.pathname.replace(/\/$/, '') || '/';
  document.querySelectorAll('.header-nav a, .mobile-menu a').forEach(function(a) {
    var href = a.getAttribute('href').replace(/\/$/, '') || '/';
    if (href === path) a.classList.add('active');
  });

  /* --- Header Scroll --- */
  var header = document.querySelector('.header');
  if (header) {
    var lastScroll = 0;
    window.addEventListener('scroll', function() {
      var st = window.scrollY;
      if (st > 50) {
        header.style.boxShadow = '0 4px 30px rgba(0,0,0,0.08)';
        header.style.borderBottomColor = 'transparent';
      } else {
        header.style.boxShadow = 'none';
        header.style.borderBottomColor = '';
      }
      lastScroll = st;
    });
  }

  /* --- Smooth Reveal on Load --- */
  document.body.style.opacity = '0';
  document.body.style.transition = 'opacity 0.5s ease';
  setTimeout(function() { document.body.style.opacity = '1'; }, 100);
});
