/**
 * Skills Visualization Module - vanilla JS, no external libraries.
 * Renders SVG circular progress rings with inner technology icons,
 * title in uppercase, and percentage readout matching original design.
 */
(function () {
  'use strict';

  var CIRCLE_CIRCUMFERENCE = 245; // 2 * PI * 39 ≈ 245 for r=39 in viewBox 0 0 90 90

  var ICONS = {
    python: '<svg viewBox="0 0 128 128" width="36" height="36"><path fill="#3776AB" d="M63.7 5c-15.8 0-25 6.9-25 19.8v10.4h25.4v3.6H28.4C14.7 38.8 5 47 5 63.6c0 16.5 11.2 24.8 24.8 24.8h8.9V77.7c0-14.2 12.3-25.7 25.4-25.7h25.4V36.3c0-13.6-9.8-31.3-25.8-31.3zM46.7 16.7c3.1 0 5.6 2.5 5.6 5.6s-2.5 5.6-5.6 5.6-5.6-2.5-5.6-5.6 2.5-5.6 5.6-5.6z"/><path fill="#FFD43B" d="M64.3 123c15.8 0 25-6.9 25-19.8V92.8H63.9v-3.6h35.7c13.7 0 23.4-8.2 23.4-24.8 0-16.5-11.2-24.8-24.8-24.8h-8.9v10.7c0 14.2-12.3 25.7-25.4 25.7H38.5v15.7c0 13.6 9.8 31.3 25.8 31.3zm17-11.7c-3.1 0-5.6-2.5-5.6-5.6s2.5-5.6 5.6-5.6 5.6 2.5 5.6 5.6-2.5 5.6-5.6 5.6z"/></svg>',
    django: '<svg viewBox="0 0 128 128" width="38" height="38"><text x="50%" y="64%" fill="#44B78B" font-family="sans-serif" font-weight="900" font-size="30" text-anchor="middle">django</text></svg>',
    flask: '<svg viewBox="0 0 24 24" width="34" height="34" fill="none" stroke="#FFFFFF" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M10 2v5.5L4.5 17.5A2 2 0 006.3 20h11.4a2 2 0 001.8-2.5L14 7.5V2H10z"/><path d="M8.5 13h7"/></svg>',
    fastapi: '<svg viewBox="0 0 24 24" width="36" height="36"><circle cx="12" cy="12" r="10" fill="#059669"/><path d="M13 3L6 14h5l-1 7 7-11h-5l1-7z" fill="#FFFFFF"/></svg>',
    tensorflow: '<svg viewBox="0 0 24 24" width="36" height="36" fill="#FF6F00"><path d="M12 2L4 6.5v9L12 20l8-4.5v-9L12 2zm0 3.2l5 2.8-5 2.8-5-2.8 5-2.8zM6 8.9l5 2.8v5.6l-5-2.8V8.9zm12 5.6l-5 2.8v-5.6l5-2.8v5.6z"/></svg>',
    pytorch: '<svg viewBox="0 0 24 24" width="36" height="36"><path fill="#EE4C2C" d="M12 2a10 10 0 100 20 10 10 0 000-20zm1 14.5h-2V13H9v-2h2V8.5h2V11h2v2h-2v3.5z"/><circle cx="15.5" cy="7.5" r="1.5" fill="#EE4C2C"/></svg>',
    postgresql: '<svg viewBox="0 0 24 24" width="36" height="36" fill="none" stroke="#336791" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2a10 10 0 0110 10c0 5.5-4.5 10-10 10S2 17.5 2 12A10 10 0 0112 2z"/><path d="M7 9c2-2 5-2 7 0s2 5 0 7l-4 4-3-3 4-4"/></svg>',
    mysql: '<svg viewBox="0 0 24 24" width="36" height="36" fill="#00758F"><path d="M12 3c-4.97 0-9 4.03-9 9 0 2.12.74 4.07 1.97 5.61L4.3 21l3.6-1.2C9.37 20.44 10.63 21 12 21c4.97 0 9-4.03 9-9s-4.03-9-9-9zm0 15c-3.31 0-6-2.69-6-6s2.69-6 6-6 6 2.69 6-6 6z"/></svg>',
    aws: '<svg viewBox="0 0 24 24" width="38" height="38"><rect width="24" height="16" x="0" y="4" rx="3" fill="#FFFFFF"/><text x="12" y="15" fill="#FF9900" font-family="sans-serif" font-weight="900" font-size="8" text-anchor="middle">aws</text></svg>',
    git: '<svg viewBox="0 0 24 24" width="36" height="36"><path fill="#F05032" d="M21.6 10.9L13.1 2.4c-.8-.8-2.1-.8-2.9 0L8.6 4.1l3.7 3.7c.6-.2 1.3 0 1.8.4.5.5.6 1.2.4 1.8l3.6 3.6c.6-.2 1.3 0 1.8.4.8.8.8 2.1 0 2.9-.8.8-2.1.8-2.9 0-.6-.6-.7-1.4-.4-2.1l-3.3-3.3v4.4c.2.1.4.3.5.5.8.8.8 2.1 0 2.9-.8.8-2.1.8-2.9 0-.8-.8-.8-2.1 0-2.9.3-.3.6-.4 1-.5V9.4c-.4-.1-.7-.3-1-.5L4.1 12.6c-.8.8-.8 2.1 0 2.9l8.5 8.5c.8.8 2.1.8 2.9 0l6.1-6.1c.8-.8.8-2.1 0-3z"/></svg>'
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
    svg.setAttribute('viewBox', '0 0 90 90');

    var bgCircle = document.createElementNS(svgNS, 'circle');
    bgCircle.setAttribute('class', 'skill-orb__bg');
    bgCircle.setAttribute('cx', '45');
    bgCircle.setAttribute('cy', '45');
    bgCircle.setAttribute('r', '39');

    var meterCircle = document.createElementNS(svgNS, 'circle');
    meterCircle.setAttribute('class', 'skill-orb__meter');
    meterCircle.setAttribute('cx', '45');
    meterCircle.setAttribute('cy', '45');
    meterCircle.setAttribute('r', '39');
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
