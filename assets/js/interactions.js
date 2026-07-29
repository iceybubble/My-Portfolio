/*!
 * Portfolio Interactions Module
 * Vanilla JS, no dependencies.
 * Handling: Scroll reveal, active nav link tracking, magnetic button hover, mobile drawer toggle.
 */
(function () {
  'use strict';

  // 1. Scroll Reveal Animations (.reveal)
  function initScrollReveal() {
    var reveals = document.querySelectorAll('.reveal');
    if (!reveals.length) return;

    if ('IntersectionObserver' in window) {
      var observer = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            observer.unobserve(entry.target);
          }
        });
      }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

      reveals.forEach(function (el) {
        observer.observe(el);
      });
    } else {
      reveals.forEach(function (el) {
        el.classList.add('is-visible');
      });
    }
  }

  // 2. Active Nav Link Tracking (ScrollSpy)
  function initScrollSpy() {
    var navLinks = document.querySelectorAll('.side-nav__link[data-target]');
    var sections = document.querySelectorAll('.section-track');

    if (!navLinks.length || !sections.length) return;

    function onScroll() {
      var scrollPos = window.scrollY + 200;
      sections.forEach(function (sec) {
        var top = sec.offsetTop;
        var height = sec.offsetHeight;
        var id = sec.getAttribute('id');
        if (scrollPos >= top && scrollPos < top + height) {
          navLinks.forEach(function (link) {
            if (link.getAttribute('data-target') === '#' + id) {
              link.classList.add('is-active');
            } else {
              link.classList.remove('is-active');
            }
          });
        }
      });
    }

    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }

  // 3. Mobile Navigation Drawer Toggle
  function initMobileDrawer() {
    var toggleBtn = document.getElementById('mobileMenuBtn');
    var drawer = document.getElementById('mobileDrawer');
    if (!toggleBtn || !drawer) return;

    toggleBtn.addEventListener('click', function () {
      drawer.classList.toggle('is-open');
    });

    var drawerLinks = drawer.querySelectorAll('a');
    drawerLinks.forEach(function (link) {
      link.addEventListener('click', function () {
        drawer.classList.remove('is-open');
      });
    });
  }

  // 4. Magnetic Hover Effect
  function initMagneticHover() {
    var magnetics = document.querySelectorAll('.magnetic');
    if (window.innerWidth < 1024) return;

    magnetics.forEach(function (elem) {
      elem.addEventListener('mousemove', function (e) {
        var rect = elem.getBoundingClientRect();
        var x = e.clientX - rect.left - rect.width / 2;
        var y = e.clientY - rect.top - rect.height / 2;
        elem.style.transform = 'translate3d(' + (x * 0.25) + 'px, ' + (y * 0.25) + 'px, 0)';
      });

      elem.addEventListener('mouseleave', function () {
        elem.style.transform = 'translate3d(0, 0, 0)';
        elem.style.transition = 'transform 0.4s ease';
      });

      elem.addEventListener('mouseenter', function () {
        elem.style.transition = 'none';
      });
    });
  }

  // 5. Custom Cursor (Dot & Trailing Ring)
  function initCustomCursor() {
    if (window.matchMedia('(pointer: coarse)').matches) return;

    var dot = document.createElement('div');
    dot.className = 'custom-cursor__dot';
    var ring = document.createElement('div');
    ring.className = 'custom-cursor__ring';
    document.body.appendChild(dot);
    document.body.appendChild(ring);

    var mouseX = -100, mouseY = -100;
    var ringX = -100, ringY = -100;
    var isHovered = false;

    window.addEventListener('mousemove', function (e) {
      mouseX = e.clientX;
      mouseY = e.clientY;
      dot.style.transform = 'translate3d(' + (mouseX - 3) + 'px, ' + (mouseY - 3) + 'px, 0)';
    }, { passive: true });

    function renderRing() {
      ringX += (mouseX - ringX) * 0.18;
      ringY += (mouseY - ringY) * 0.18;
      var offset = isHovered ? 25 : 17;
      ring.style.transform = 'translate3d(' + (ringX - offset) + 'px, ' + (ringY - offset) + 'px, 0)';
      requestAnimationFrame(renderRing);
    }
    requestAnimationFrame(renderRing);

    var selector = 'a, button, input, textarea, .btn, .side-nav__link, .card, .project-card, [role="button"]';
    document.addEventListener('mouseover', function (e) {
      if (e.target.closest(selector)) {
        isHovered = true;
        document.body.classList.add('cursor-hover');
      }
    });
    document.addEventListener('mouseout', function (e) {
      if (e.target.closest(selector)) {
        isHovered = false;
        document.body.classList.remove('cursor-hover');
      }
    });

    document.addEventListener('mouseleave', function () {
      dot.style.opacity = '0';
      ring.style.opacity = '0';
    });
    document.addEventListener('mouseenter', function () {
      dot.style.opacity = '1';
      ring.style.opacity = '1';
    });
  }

  document.addEventListener('DOMContentLoaded', function () {
    initScrollReveal();
    initScrollSpy();
    initMobileDrawer();
    initMagneticHover();
    initCustomCursor();
  });
})();
