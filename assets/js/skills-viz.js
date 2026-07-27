/**
 * Skills Visualization Module - vanilla JS, no external libraries.
 * Renders SVG circular progress rings and percentage animation inside .skill-orb containers.
 */
(function () {
  'use strict';

  var GOLD = '#D4A574';
  var AMBER = '#E8B988';
  var CIRCLE_CIRCUMFERENCE = 180; // 2 * PI * 28.65 ≈ 180

  function createOrbUI(orb) {
    var skillName = orb.getAttribute('data-skill-name') || 'Skill';
    var skillLevel = parseInt(orb.getAttribute('data-skill-level') || '80', 10);

    // Create Circle SVG
    var circleWrap = document.createElement('div');
    circleWrap.className = 'skill-orb__circle';

    var svgNS = 'http://www.w3.org/2000/svg';
    var svg = document.createElementNS(svgNS, 'svg');
    svg.setAttribute('viewBox', '0 0 64 64');

    var bgCircle = document.createElementNS(svgNS, 'circle');
    bgCircle.setAttribute('class', 'skill-orb__bg');
    bgCircle.setAttribute('cx', '32');
    bgCircle.setAttribute('cy', '32');
    bgCircle.setAttribute('r', '28.65');

    var meterCircle = document.createElementNS(svgNS, 'circle');
    meterCircle.setAttribute('class', 'skill-orb__meter');
    meterCircle.setAttribute('cx', '32');
    meterCircle.setAttribute('cy', '32');
    meterCircle.setAttribute('r', '28.65');
    meterCircle.style.strokeDasharray = CIRCLE_CIRCUMFERENCE;
    meterCircle.style.strokeDashoffset = CIRCLE_CIRCUMFERENCE;

    svg.appendChild(bgCircle);
    svg.appendChild(meterCircle);

    var valSpan = document.createElement('span');
    valSpan.className = 'skill-orb__val';
    valSpan.textContent = '0%';

    circleWrap.appendChild(svg);
    circleWrap.appendChild(valSpan);

    var nameSpan = document.createElement('span');
    nameSpan.className = 'skill-orb__name';
    nameSpan.textContent = skillName;

    orb.innerHTML = '';
    orb.appendChild(circleWrap);
    orb.appendChild(nameSpan);

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

    var start = 0;
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
