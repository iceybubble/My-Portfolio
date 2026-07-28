/**
 * Skills Visualization Module - vanilla JS.
 * Renders small circular progress rings with clean mini tech icons,
 * uppercase labels, and percentage readout matching original proportions.
 */
(function () {
  'use strict';

  var CIRCLE_CIRCUMFERENCE = 138.23; // 2 * PI * 22 ≈ 138.23 for r=22 in viewBox 0 0 52 52

  var ICONS = {
    python: '<svg viewBox="0 0 128 128" width="24" height="24"><path fill="#3776AB" d="M63.7 5c-15.8 0-25 6.9-25 19.8v10.4h25.4v3.6H28.4C14.7 38.8 5 47 5 63.6c0 16.5 11.2 24.8 24.8 24.8h8.9V77.7c0-14.2 12.3-25.7 25.4-25.7h25.4V36.3c0-13.6-9.8-31.3-25.8-31.3zM46.7 16.7c3.1 0 5.6 2.5 5.6 5.6s-2.5 5.6-5.6 5.6-5.6-2.5-5.6-5.6 2.5-5.6 5.6-5.6z"/><path fill="#FFD43B" d="M64.3 123c15.8 0 25-6.9 25-19.8V92.8H63.9v-3.6h35.7c13.7 0 23.4-8.2 23.4-24.8 0-16.5-11.2-24.8-24.8-24.8h-8.9v10.7c0 14.2-12.3 25.7-25.4 25.7H38.5v15.7c0 13.6 9.8 31.3 25.8 31.3zm17-11.7c-3.1 0-5.6-2.5-5.6-5.6s2.5-5.6 5.6-5.6 5.6 2.5 5.6 5.6-2.5 5.6-5.6 5.6z"/></svg>',
    elastic: '<svg viewBox="0 0 24 24" width="24" height="24" fill="none"><path d="M12 2L2 7l10 5 10-5-10-5z" fill="#00BFB3"/><path d="M2 17l10 5 10-5" stroke="#F04E98" stroke-width="2"/><path d="M2 12l10 5 10-5" stroke="#FEB6C1" stroke-width="2"/></svg>',
    burp: '<svg viewBox="0 0 24 24" width="24" height="24" fill="none"><rect width="20" height="20" x="2" y="2" rx="4" fill="#FF6600"/><path d="M7 8h10M7 12h8M7 16h6" stroke="#FFFFFF" stroke-width="2" stroke-linecap="round"/></svg>',
    linux: '<svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="#D4A574" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4" width="18" height="16" rx="3"/><path d="M7 9l4 3-4 3M13 15h4"/></svg>',
    fastapi: '<svg viewBox="0 0 24 24" width="24" height="24"><circle cx="12" cy="12" r="10" fill="#059669"/><path d="M13 3L6 14h5l-1 7 7-11h-5l1-7z" fill="#FFFFFF"/></svg>',
    react: '<svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="#61DAFB" stroke-width="1.8"><ellipse cx="12" cy="12" rx="9" ry="3.6"/><ellipse cx="12" cy="12" rx="9" ry="3.6" transform="rotate(60 12 12)"/><ellipse cx="12" cy="12" rx="9" ry="3.6" transform="rotate(120 12 12)"/><circle cx="12" cy="12" r="1.5" fill="#61DAFB"/></svg>',
    mongodb: '<svg viewBox="0 0 24 24" width="24" height="24" fill="#47A248"><path d="M12 2C11.5 5 8 9 8 13c0 3.3 2.7 6 6 6s6-2.7 6-6c0-4-3.5-8-4-11h-4zm0 17v3"/></svg>',
    cloudsec: '<svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="#E8B988" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 10h-1.26A8 8 0 109 20h9a5 5 0 000-10z"/><path d="M12 11v4M12 15l-2-2M12 15l2-2"/></svg>',
    pytorch: '<svg viewBox="0 0 24 24" width="24" height="24"><path fill="#EE4C2C" d="M12 2a10 10 0 100 20 10 10 0 000-20zm1 14.5h-2V13H9v-2h2V8.5h2V11h2v2h-2v3.5z"/><circle cx="15.5" cy="7.5" r="1.5" fill="#EE4C2C"/></svg>',
    git: '<svg viewBox="0 0 24 24" width="24" height="24"><path fill="#F05032" d="M21.6 10.9L13.1 2.4c-.8-.8-2.1-.8-2.9 0L8.6 4.1l3.7 3.7c.6-.2 1.3 0 1.8.4.5.5.6 1.2.4 1.8l3.6 3.6c.6-.2 1.3 0 1.8.4.8.8.8 2.1 0 2.9-.8.8-2.1.8-2.9 0-.6-.6-.7-1.4-.4-2.1l-3.3-3.3v4.4c.2.1.4.3.5.5.8.8.8 2.1 0 2.9-.8.8-2.1.8-2.9 0-.8-.8-.8-2.1 0-2.9.3-.3.6-.4 1-.5V9.4c-.4-.1-.7-.3-1-.5L4.1 12.6c-.8.8-.8 2.1 0 2.9l8.5 8.5c.8.8 2.1.8 2.9 0l6.1-6.1c.8-.8.8-2.1 0-3z"/></svg>'
  };

  function createOrbUI(orb) {
    var skillId = orb.getAttribute('data-skill-id') || 'python';
    var skillName = orb.getAttribute('data-skill-name') || 'PYTHON';
    var skillLevel = parseInt(orb.getAttribute('data-skill-level') || '80', 10);

    // Create Circle SVG
    var circleWrap = document.createElement('div');
    circleWrap.className = 'skill-orb__circle';

    var svgNS = 'http://www.w3.org/2000/svg';
    var svg = document.createElementNS(svgNS, 'svg');
    svg.setAttribute('class', 'ring-svg');
    svg.setAttribute('viewBox', '0 0 52 52');

    var bgCircle = document.createElementNS(svgNS, 'circle');
    bgCircle.setAttribute('class', 'skill-orb__bg');
    bgCircle.setAttribute('cx', '26');
    bgCircle.setAttribute('cy', '26');
    bgCircle.setAttribute('r', '22');

    var meterCircle = document.createElementNS(svgNS, 'circle');
    meterCircle.setAttribute('class', 'skill-orb__meter');
    meterCircle.setAttribute('cx', '26');
    meterCircle.setAttribute('cy', '26');
    meterCircle.setAttribute('r', '22');
    meterCircle.style.strokeDasharray = CIRCLE_CIRCUMFERENCE;
    meterCircle.style.strokeDashoffset = CIRCLE_CIRCUMFERENCE;

    svg.appendChild(bgCircle);
    svg.appendChild(meterCircle);

    var iconDiv = document.createElement('div');
    iconDiv.className = 'skill-orb__icon';
    iconDiv.innerHTML = ICONS[skillId] || '';

    circleWrap.appendChild(svg);
    circleWrap.appendChild(iconDiv);

    var nameSpan = document.createElement('span');
    nameSpan.className = 'skill-orb__name';
    nameSpan.textContent = skillName.toUpperCase();

    var valSpan = document.createElement('span');
    valSpan.className = 'skill-orb__val';
    valSpan.textContent = '0%';

    orb.innerHTML = '';
    orb.appendChild(circleWrap);
    orb.appendChild(nameSpan);
    orb.appendChild(valSpan);

    orb.setAttribute('data-target-level', skillLevel);
  }

  function animateOrb(orb) {
    if (orb.classList.contains('is-animated')) return;
    orb.classList.add('is-animated');

    var targetLevel = parseInt(orb.getAttribute('data-target-level') || '80', 10);
    var meter = orb.querySelector('.skill-orb__meter');
    var valSpan = orb.querySelector('.skill-orb__val');

    var targetOffset = CIRCLE_CIRCUMFERENCE - (CIRCLE_CIRCUMFERENCE * (targetLevel / 100));

    if (meter) {
      setTimeout(function () {
        meter.style.strokeDashoffset = targetOffset;
      }, 100);
    }

    var duration = 1200;
    var startTime = null;

    function step(timestamp) {
      if (!startTime) startTime = timestamp;
      var progress = Math.min((timestamp - startTime) / duration, 1);
      var currentVal = Math.floor(progress * targetLevel);
      if (valSpan) valSpan.textContent = currentVal + '%';
      if (progress < 1) {
        window.requestAnimationFrame(step);
      }
    }
    window.requestAnimationFrame(step);
  }

  function initSkillsViz() {
    var orbs = document.querySelectorAll('.skill-orb');
    if (!orbs.length) return;

    orbs.forEach(function (orb) {
      createOrbUI(orb);
    });

    if ('IntersectionObserver' in window) {
      var observer = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            animateOrb(entry.target);
            observer.unobserve(entry.target);
          }
        });
      }, { threshold: 0.2 });

      orbs.forEach(function (orb) {
        observer.observe(orb);
      });
    } else {
      orbs.forEach(function (orb) {
        animateOrb(orb);
      });
    }
  }

  document.addEventListener('DOMContentLoaded', initSkillsViz);
})();
