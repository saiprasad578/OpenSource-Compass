/**
 * OpenSource Compass - Interactions
 * Scroll animations, smooth scrolling, dynamic data loading
 * + Skeleton Loader for Home Programs
 */

document.addEventListener('DOMContentLoaded', () => {
  initScrollReveal();
  initSmoothScroll();
  loadHomePrograms();
});

/* =========================
   SCROLL REVEAL ANIMATION
========================= */
function initScrollReveal() {
  const elements = document.querySelectorAll('.fade-in-up');
  if (!elements.length) return;

  if (!('IntersectionObserver' in window)) {
    elements.forEach(el => el.classList.add('active'));
    return;
  }

  const observer = new IntersectionObserver(
    entries => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;

        entry.target.classList.add('active');
        observer.unobserve(entry.target);
      });
    },
    {
      threshold: 0.15,
      rootMargin: '0px 0px -50px 0px'
    }
  );

  elements.forEach(el => observer.observe(el));
}

/* =========================
   SMOOTH SCROLL (NAV)
========================= */
function initSmoothScroll() {
  document.addEventListener('click', e => {
    const link = e.target.closest('nav a[href^="#"]');
    if (!link) return;

    const targetId = link.getAttribute('href');
    if (targetId === '#') return;

    const target = document.querySelector(targetId);
    if (!target) return;

    e.preventDefault();
    target.scrollIntoView({ behavior: 'smooth' });
  });
}

/* =========================
   HOME PAGE PROGRAMS
   (With Skeleton Loader)
========================= */
function loadHomePrograms() {
  const container = document.getElementById('programs-container');
  if (!container) return;

  // 1️⃣ Show skeleton loader immediately
  container.innerHTML = Array.from({ length: 3 })
    .map(
      () => `
      <div class="card skeleton">
        <div class="skeleton-title"></div>
        <div class="skeleton-text"></div>
        <div class="skeleton-badge"></div>
      </div>
    `
    )
    .join('');

  // 2️⃣ Fetch actual data
  fetchPrograms()
    .then(programs => {
      renderPrograms(programs, container);
      initScrollReveal(); // re-attach animation for new cards
    })
    .catch(() => {
      container.innerHTML = `
        <div class="error-message">
          <p>Unable to load programs right now.</p>
        </div>
      `;
    });
}

/* =========================
   FETCH PROGRAM DATA
========================= */
function fetchPrograms() {
  return fetch('../data/programs.json')
    .then(res => {
      if (!res.ok) throw new Error('Failed to fetch');
      return res.json();
    });
}

/* =========================
   RENDER PROGRAM CARDS
========================= */
function renderPrograms(programs, container) {
  container.innerHTML = programs
    .map(
      p => `
      <div class="card fade-in-up">
        <h4>${p.name}</h4>
        <p>${p.description}</p>
        <span class="badge">${p.difficulty}</span>
      </div>
    `
    )
    .join('');
}
