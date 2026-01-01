// Ruby Ember System - lightweight CSS-based embers with seeded randomness

// Seeded random number generator
function seededRandom(seed) {
  const x = Math.sin(seed++) * 10000;
  return x - Math.floor(x);
}

// Generate a seed from string (player ID)
function stringToSeed(str) {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash;
  }
  return Math.abs(hash);
}

// Create CSS keyframes for an ember's arc trajectory
function createEmberKeyframes(name, vx, vy, gravity, duration) {
  const steps = 10;
  let keyframes = `@keyframes ${name} {\n`;

  for (let i = 0; i <= steps; i++) {
    const progress = i / steps;
    const t = progress * duration;
    const x = vx * t;
    const y = vy * t + 0.5 * gravity * t * t;
    const opacity = 1 - Math.pow(progress, 0.6);
    const scale = 1 - progress * 0.8;

    // Color fade: bright -> dark
    const r = Math.max(0, Math.round(255 - progress * 255));
    const g = Math.max(0, Math.round(200 * (1 - progress * 1.3)));

    keyframes += `  ${Math.round(progress * 100)}% {
    transform: translate(${x}px, ${y}px) scale(${scale});
    opacity: ${opacity};
    background: rgb(${r}, ${g}, 0);
    box-shadow: 0 0 ${4 * (1 - progress)}px rgba(${r}, ${Math.round(g * 0.7)}, 0, ${opacity});
  }\n`;
  }

  keyframes += '}';
  return keyframes;
}

// Initialize embers for a container
function initEmbers(container) {
  if (container._embersInit) return;
  container._embersInit = true;

  const parent = container.closest('[data-id]');
  const seedStr = parent ? parent.dataset.id : `${container.offsetLeft}-${container.offsetTop}`;
  const baseSeed = stringToSeed(seedStr);

  // Create style element for this container's keyframes
  const styleEl = document.createElement('style');
  const emberId = `ember-${baseSeed}`;
  let css = '';

  // Create 4-6 embers
  const emberCount = 4 + Math.floor(seededRandom(baseSeed) * 3);

  for (let i = 0; i < emberCount; i++) {
    const rng = (offset) => seededRandom(baseSeed + i * 100 + offset);

    const startX = 15 + rng(1) * 70;
    const size = 3 + rng(2) * 3;
    const launchAngle = -75 + rng(3) * 25; // -75 to -50 degrees
    const launchSpeed = 80 + rng(4) * 60; // 80-140 pixels
    const duration = 2 + rng(5) * 1.5; // 2-3.5 seconds
    const delay = rng(6) * 2.5; // 0-2.5 second delay

    const radians = launchAngle * Math.PI / 180;
    const vx = Math.cos(radians) * launchSpeed * (rng(7) > 0.5 ? 1 : -1);
    const vy = Math.sin(radians) * launchSpeed;
    const gravity = 80;

    const animName = `${emberId}-${i}`;
    css += createEmberKeyframes(animName, vx, vy, gravity, duration) + '\n';

    const ember = document.createElement('div');
    ember.className = 'ruby-ember';
    ember.style.cssText = `
      width: ${size}px;
      height: ${size}px;
      left: ${startX}%;
      bottom: 25%;
      background: rgb(255, 200, 50);
      box-shadow: 0 0 ${size}px rgba(255, 180, 0, 0.9);
      animation: ${animName} ${duration}s ease-out infinite;
      animation-delay: ${delay}s;
    `;

    container.appendChild(ember);
  }

  styleEl.textContent = css;
  container.appendChild(styleEl);
  container._emberStyle = styleEl;
}

// Cleanup
function cleanupEmbers(container) {
  if (container._emberStyle) {
    container._emberStyle.remove();
  }
  container.querySelectorAll('.ruby-ember').forEach(e => e.remove());
  container._embersInit = false;
}

// Observer
function observeRubyElements() {
  const observer = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
      // Handle node additions/removals
      mutation.addedNodes.forEach((node) => {
        if (node.nodeType === 1) {
          if (node.classList?.contains('tier-ruby-v2')) initEmbers(node);
          node.querySelectorAll?.('.tier-ruby-v2').forEach(initEmbers);
        }
      });
      mutation.removedNodes.forEach((node) => {
        if (node.nodeType === 1) {
          if (node.classList?.contains('tier-ruby-v2')) cleanupEmbers(node);
          node.querySelectorAll?.('.tier-ruby-v2').forEach(cleanupEmbers);
        }
      });

      // Handle class changes (for when tier class is added/removed without node change)
      if (mutation.type === 'attributes' && mutation.attributeName === 'class') {
        const target = mutation.target;
        if (target.classList?.contains('tier-ruby-v2')) {
          if (!target._embersInit) initEmbers(target);
        } else {
          if (target._embersInit) cleanupEmbers(target);
        }
      }
    });
  });

  observer.observe(document.body, { childList: true, subtree: true, attributes: true, attributeFilter: ['class'] });
  document.querySelectorAll('.tier-ruby-v2').forEach(initEmbers);
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', observeRubyElements);
} else {
  observeRubyElements();
}
