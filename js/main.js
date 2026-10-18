/* ===== CLYVEXA — Advanced UI JS ===== */

/* --- Splash Screen --- */
(function() {
  var splash = document.getElementById('splash-screen');
  if (!splash) return;
  var shown = sessionStorage.getItem('clyvexa-splash');
  if (shown) { splash.style.display = 'none'; return; }

  function dismissSplash() {
    if (splash.classList.contains('hide')) return;
    splash.classList.add('hide');
    sessionStorage.setItem('clyvexa-splash', '1');
    setTimeout(function() { splash.style.display = 'none'; }, 600);
  }

  // Dismiss on click or after 2s
  splash.style.cursor = 'pointer';
  splash.addEventListener('click', dismissSplash);
  setTimeout(dismissSplash, 2000);
})();

/* --- Particles --- */
(function() {
  var canvas = document.getElementById('particles');
  if (!canvas) return;
  var ctx = canvas.getContext('2d');
  var particles = [];
  var count = window.innerWidth < 768 ? 25 : 50;

  function resize() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }
  resize();
  window.addEventListener('resize', resize);

  function Particle() {
    this.x = Math.random() * canvas.width;
    this.y = Math.random() * canvas.height;
    this.vx = (Math.random() - 0.5) * 0.3;
    this.vy = (Math.random() - 0.5) * 0.3;
    this.r = Math.random() * 2 + 0.5;
    this.alpha = Math.random() * 0.35 + 0.15;
  }
  for (var i = 0; i < count; i++) particles.push(new Particle());

  function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    var isDark = document.documentElement.getAttribute('data-theme') === 'dark';
    var color = isDark ? '0,240,255' : '59,130,246';
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
        if (dist < 110) {
          ctx.beginPath();
          ctx.moveTo(p.x, p.y);
          ctx.lineTo(p2.x, p2.y);
          ctx.strokeStyle = 'rgba(' + color + ',' + (0.07 * (1 - dist / 110)) + ')';
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

  var mx = -100, my = -100, rx = -100, ry = -100;
  var hasMoved = false;

  document.addEventListener('mousemove', function(e) {
    mx = e.clientX;
    my = e.clientY;
    if (!hasMoved) {
      hasMoved = true;
      dot.style.opacity = '1';
      ring.style.opacity = '1';
      rx = mx;
      ry = my;
    }
    dot.style.transform = 'translate(' + mx + 'px,' + my + 'px) translate(-50%,-50%)';
  });

  function animRing() {
    if (hasMoved) {
      rx += (mx - rx) * 0.18;
      ry += (my - ry) * 0.18;
      ring.style.left = rx + 'px';
      ring.style.top = ry + 'px';
    }
    requestAnimationFrame(animRing);
  }
  animRing();

  function addHoverEvents() {
    var hoverEls = document.querySelectorAll('a, button, .card, .btn, .stat-card, .value-card, .team-card');
    hoverEls.forEach(function(el) {
      el.addEventListener('mouseenter', function() {
        ring.classList.add('hover');
        dot.classList.add('hover');
      });
      el.addEventListener('mouseleave', function() {
        ring.classList.remove('hover');
        dot.classList.remove('hover');
      });
    });
  }
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', addHoverEvents);
  } else {
    addHoverEvents();
  }
})();

/* --- Interactive DOM Functionality --- */
document.addEventListener('DOMContentLoaded', function() {
  /* --- Mobile Nav --- */
  var toggle = document.getElementById('mobile-toggle');
  var menu = document.getElementById('mobile-menu');
  if (toggle && menu) {
    function openMenu() {
      menu.classList.add('open');
      toggle.classList.add('active');
      toggle.setAttribute('aria-expanded', 'true');
      document.body.style.overflow = 'hidden';
    }
    function closeMenu() {
      menu.classList.remove('open');
      toggle.classList.remove('active');
      toggle.setAttribute('aria-expanded', 'false');
      document.body.style.overflow = '';
    }

    toggle.addEventListener('click', function(e) {
      e.stopPropagation();
      if (menu.classList.contains('open')) {
        closeMenu();
      } else {
        openMenu();
      }
    });

    menu.querySelectorAll('a').forEach(function(a) {
      a.addEventListener('click', closeMenu);
    });

    document.addEventListener('click', function(e) {
      if (menu.classList.contains('open') && !menu.contains(e.target) && e.target !== toggle) {
        closeMenu();
      }
    });
  }

  /* --- Theme Toggle --- */
  var themeBtn = document.getElementById('theme-toggle');
  var html = document.documentElement;

  function updateThemeIcon() {
    if (!themeBtn) return;
    var current = html.getAttribute('data-theme');
    themeBtn.setAttribute('title', current === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode');
    themeBtn.setAttribute('aria-label', current === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode');
  }
  updateThemeIcon();

  if (themeBtn) {
    themeBtn.addEventListener('click', function() {
      var current = html.getAttribute('data-theme');
      var next = current === 'dark' ? 'light' : 'dark';
      html.setAttribute('data-theme', next);
      localStorage.setItem('clyvexa-theme', next);
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
    }, { threshold: 0.08, rootMargin: '0px 0px -30px 0px' });
    animateEls.forEach(function(el) { observer.observe(el); });
  } else {
    animateEls.forEach(function(el) { el.classList.add('visible'); });
  }

  /* --- Rotating Hero Text --- */
  var rotatingEl = document.getElementById('rotating-text');
  if (rotatingEl) {
    var texts = ['Starting Our Journey', 'Building Intelligent Solutions', 'Innovating with AI', 'Ready to Scale Together'];
    var idx = 0;
    setInterval(function() {
      rotatingEl.style.opacity = '0';
      rotatingEl.style.transform = 'translateY(8px)';
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
          var duration = 1800;
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
    }, { threshold: 0.25 });
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
        var rotateX = (y - centerY) / centerY * -4;
        var rotateY = (x - centerX) / centerX * 4;
        card.style.transform = 'perspective(1000px) rotateX(' + rotateX + 'deg) rotateY(' + rotateY + 'deg) translateY(-6px)';
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
        var clampedX = Math.max(-15, Math.min(15, x * 0.15));
        var clampedY = Math.max(-15, Math.min(15, y * 0.15));
        el.style.transform = 'translate(' + clampedX + 'px,' + clampedY + 'px)';
      });
      el.addEventListener('mouseleave', function() {
        el.style.transform = 'translate(0,0)';
      });
    });
  }

  /* --- Local file:// link fallback --- */
  if (window.location.protocol === 'file:') {
    document.querySelectorAll('a[href]').forEach(function(a) {
      var href = a.getAttribute('href');
      if (href && !href.startsWith('http') && !href.startsWith('#') && !href.startsWith('mailto:') && !href.startsWith('tel:') && !href.startsWith('javascript:')) {
        if (href === '/' || href === '') {
          a.setAttribute('href', 'index.html');
        } else if (href.startsWith('/')) {
          a.setAttribute('href', href.substring(1) + '.html');
        }
      }
    });
  }

  /* --- Active Nav --- */
  var rawPath = window.location.pathname.replace(/\/$/, '').split('/').filter(Boolean).pop() || '';
  var currentRoute = rawPath.replace(/\.html$/, '');
  if (currentRoute === 'index' || currentRoute === '') currentRoute = 'home';

  document.querySelectorAll('.header-nav a, .mobile-menu a').forEach(function(a) {
    var href = a.getAttribute('href');
    if (!href || href.startsWith('http') || href.startsWith('tel:') || href.startsWith('mailto:')) return;
    var target = href.replace(/\/$/, '').split('/').filter(Boolean).pop() || '';
    target = target.replace(/\.html$/, '');
    if (target === 'index' || target === '' || href === '/') target = 'home';

    if (target === currentRoute) {
      a.classList.add('active');
    } else {
      a.classList.remove('active');
    }
  });

  /* --- Header Scroll Effect --- */
  var header = document.querySelector('.header');
  if (header) {
    window.addEventListener('scroll', function() {
      var st = window.scrollY;
      if (st > 40) {
        header.classList.add('scrolled');
      } else {
        header.classList.remove('scrolled');
      }
    }, { passive: true });
  }
});
