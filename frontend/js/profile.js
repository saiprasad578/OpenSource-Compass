// Profile icon functionality
document.addEventListener('DOMContentLoaded', () => {
    updateProfileIcon();
});

function updateProfileIcon() {
    const nav = document.querySelector('nav');
    if (!nav) return;

    // Remove existing profile dropdown or login link
    nav.querySelectorAll('.profile-dropdown, .login-link').forEach(el => el.remove());

    const currentUser = getCurrentUser();

    if (!currentUser) {
        showLoginLink(nav);
        return;
    }

    const profileDropdown = document.createElement('div');
    profileDropdown.className = 'profile-dropdown';

    /* =====================
       PROFILE ICON
    ===================== */
    const profileIcon = document.createElement('div');
    profileIcon.className = 'profile-icon';
    profileIcon.textContent = currentUser.name.charAt(0).toUpperCase();
    profileIcon.title = currentUser.name;
    profileIcon.addEventListener('click', toggleProfileMenu);

    // 🟢 Online status indicator (NEW FEATURE)
    const statusDot = document.createElement('span');
    statusDot.className = 'profile-status';
    profileIcon.appendChild(statusDot);

    /* =====================
       PROFILE MENU
    ===================== */
    const profileMenu = document.createElement('div');
    profileMenu.className = 'profile-menu';
    profileMenu.id = 'profileMenu';

    profileMenu.appendChild(createMenuItem(currentUser.name, true));
    profileMenu.appendChild(createMenuItem(currentUser.email, false, true));

    const logoutLink = document.createElement('a');
    logoutLink.href = '#';
    logoutLink.className = 'profile-menu-item logout';
    logoutLink.textContent = 'Logout';
    logoutLink.addEventListener('click', e => {
        e.preventDefault();
        logout();
    });

    profileMenu.appendChild(logoutLink);

    profileDropdown.appendChild(profileIcon);
    profileDropdown.appendChild(profileMenu);
    nav.appendChild(profileDropdown);
}

/* =====================
   HELPERS
===================== */
function createMenuItem(text, bold = false, muted = false) {
    const item = document.createElement('div');
    item.className = 'profile-menu-item';
    item.textContent = text;

    if (bold) {
        item.style.fontWeight = '600';
        item.style.color = 'var(--primary-blue)';
    }

    if (muted) {
        item.style.fontSize = '12px';
        item.style.color = '#666';
    }

    return item;
}

function showLoginLink(nav) {
    const loginLink = document.createElement('a');
    loginLink.href = '../pages/login.html';
    loginLink.textContent = 'Login';
    loginLink.className = 'login-link';
    loginLink.style.marginLeft = '24px';
    nav.appendChild(loginLink);
}

function toggleProfileMenu(e) {
    e.stopPropagation();
    const menu = document.getElementById('profileMenu');
    if (!menu) return;

    menu.classList.toggle('active');

    if (menu.classList.contains('active')) {
        document.addEventListener('click', closeMenuOnOutsideClick);
    }
}

function closeMenuOnOutsideClick(e) {
    if (!e.target.closest('.profile-dropdown')) {
        const menu = document.getElementById('profileMenu');
        if (menu) menu.classList.remove('active');
        document.removeEventListener('click', closeMenuOnOutsideClick);
    }
}

// Note: getCurrentUser() and logout() are defined in auth.js
