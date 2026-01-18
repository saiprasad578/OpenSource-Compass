/* =========================
   CONSTANTS
========================= */
const STORAGE_KEYS = {
  SIDEBAR: 'sidebarState',
  CHECKBOXES: 'progressCheckboxes'
};

/* =========================
   ELEMENT REFERENCES
========================= */
const sidebar = document.getElementById('sidebar');
const overlay = document.getElementById('overlay');
const toggleBtn = document.getElementById('toggle-sidebar');

/* =========================
   INIT
========================= */
document.addEventListener('DOMContentLoaded', () => {
  restoreSidebarState();
  restoreCheckboxProgress();
});

/* =========================
   SIDEBAR TOGGLE (MOBILE)
========================= */
if (toggleBtn && sidebar && overlay) {
  toggleBtn.addEventListener('click', () => {
    openSidebar();
  });

  overlay.addEventListener('click', closeSidebar);
}

function openSidebar() {
  sidebar.classList.add('active');
  overlay.classList.add('active');
  localStorage.setItem(STORAGE_KEYS.SIDEBAR, 'open');
}

function closeSidebar() {
  sidebar?.classList.remove('active');
  overlay?.classList.remove('active');
  localStorage.setItem(STORAGE_KEYS.SIDEBAR, 'closed');
}

function restoreSidebarState() {
  const state = localStorage.getItem(STORAGE_KEYS.SIDEBAR);
  if (state === 'open') {
    sidebar?.classList.add('active');
    overlay?.classList.add('active');
  }
}

/* =========================
   COPY TO CLIPBOARD
   (Event Delegation)
========================= */
document.addEventListener('click', e => {
  if (!e.target.classList.contains('copy-btn')) return;

  const codeBlock = e.target.closest('.code-block')?.querySelector('pre');
  if (!codeBlock) return;

  navigator.clipboard.writeText(codeBlock.innerText).then(() => {
    e.target.textContent = 'Copied!';
    e.target.classList.add('copied');

    setTimeout(() => {
      e.target.textContent = 'Copy';
      e.target.classList.remove('copied');
    }, 2000);
  });
});

/* =========================
   PROGRESS CHECKBOXES
========================= */
document.addEventListener('change', e => {
  if (!e.target.classList.contains('progress-checkbox')) return;

  const label = e.target.nextElementSibling;
  if (label) {
    label.style.textDecoration = e.target.checked ? 'line-through' : 'none';
    label.style.color = e.target.checked ? '#666' : 'inherit';
  }

  saveCheckboxProgress(e.target);
});

function saveCheckboxProgress(checkbox) {
  const saved = JSON.parse(localStorage.getItem(STORAGE_KEYS.CHECKBOXES)) || {};
  saved[checkbox.id] = checkbox.checked;
  localStorage.setItem(STORAGE_KEYS.CHECKBOXES, JSON.stringify(saved));
}

function restoreCheckboxProgress() {
  const saved = JSON.parse(localStorage.getItem(STORAGE_KEYS.CHECKBOXES)) || {};

  document.querySelectorAll('.progress-checkbox').forEach(cb => {
    if (saved[cb.id]) {
      cb.checked = true;
      cb.dispatchEvent(new Event('change'));
    }
  });
}

/* =========================
   SIDEBAR LINK SCROLL
========================= */
document.addEventListener('click', e => {
  const link = e.target.closest('.sidebar-menu a');
  if (!link) return;

  e.preventDefault();
  setActiveSidebarLink(link);

  const target = document.querySelector(link.getAttribute('href'));
  if (!target) return;

  window.scrollTo({
    top: target.offsetTop - 100,
    behavior: 'smooth'
  });

  if (window.innerWidth <= 992) closeSidebar();
});

function setActiveSidebarLink(activeLink) {
  document.querySelectorAll('.sidebar-menu a')
    .forEach(link => link.classList.remove('active'));

  activeLink.classList.add('active');
}

/* =========================
   ACTIVE LINK ON SCROLL
========================= */
window.addEventListener('scroll', () => {
  const sections = document.querySelectorAll('section[id]');
  let currentId = '';

  sections.forEach(section => {
    if (window.pageYOffset >= section.offsetTop - 150) {
      currentId = `#${section.id}`;
    }
  });

  document.querySelectorAll('.sidebar-menu a').forEach(link => {
    link.classList.toggle(
      'active',
      link.getAttribute('href') === currentId
    );
  });
});

/* =========================
   KEYBOARD SHORTCUTS
========================= */
document.addEventListener('keydown', e => {
  // Ctrl + B → Toggle sidebar
  if (e.ctrlKey && e.key.toLowerCase() === 'b') {
    e.preventDefault();
    sidebar?.classList.toggle('active');
    overlay?.classList.toggle('active');
  }

  // Esc → Close sidebar
  if (e.key === 'Escape') {
    closeSidebar();
  }
});
