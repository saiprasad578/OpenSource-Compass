// =====================
// PROFILE ICON SETUP
// =====================
document.addEventListener('DOMContentLoaded', updateProfileIcon);

function updateProfileIcon() {
    const nav = document.querySelector('nav');
    if (!nav) return;

    // Cleanup existing UI
    nav.querySelectorAll('.profile-dropdown, .login-link').forEach(el => el.remove());

    const user = getCurrentUser();

    if (!user) {
        renderLoginLink(nav);
        return;
    }

    const dropdown = document.createElement('div');
    dropdown.className = 'profile-dropdown';

    const icon = createProfileIcon(user);
    const menu = createProfileMenu(user);

    dropdown.append(icon, menu);
    nav.appendChild(dropdown);
}

// =====================
// PROFILE ICON
// =====================
function createProfileIcon(user) {
    const icon = document.createElement('div');
    icon.className = 'profile-icon';
    icon.textContent = user.name[0].toUpperCase();
    icon.title = user.name;

    // Online status dot
    const status = document.createElement('span');
    status.className = 'profile-status';
    icon.appendChild(status);

    icon.addEventListener('click', e => {
        e.stopPropagation();
        toggleMenu();
    });

    return icon;
}

// =====================
// PROFILE MENU
// =====================
function createProfileMenu(user) {
    const menu = document.createElement('div');
    menu.className = 'profile-menu';
    menu.id = 'profileMenu';

    menu.append(
        menuItem(user.name, { bold: true }),
        menuItem(user.email, { muted: true }),
        logoutItem()
    );

    return menu;
}

// =====================
// MENU ITEMS
// =====================
function menuItem(text, options = {}) {
    const item = document.createElement('div');
    item.className = 'profile-menu-item';
    item.textContent = text;

    if (options.bold) {
        item.style.fontWeight = '600';
        item.style.color = 'var(--primary-blue)';
    }

    if (options.muted) {
        item.style.fontSize = '12px';
        item.style.color = '#666';
    }

    return item;
}

function logoutItem() {
    const item = document.createElement('a');
    item.href = '#';
    item.className = 'profile-menu-item logout';
    item.textContent = 'Logout';

    item.addEventListener('click', e => {
        e.preventDefault();
        logout();
    });

    return item;
}

// =====================
// LOGIN LINK
// =====================
function renderLoginLink(nav) {
    const link = document.createElement('a');
    link.href = '../pages/login.html';
    link.textContent = 'Login';
    link.className = 'login-link';
    link.style.marginLeft = '24px';
    nav.appendChild(link);
}

// =====================
// MENU TOGGLE & OUTSIDE CLICK
// =====================
function toggleMenu() {
    const menu = document.getElementById('profileMenu');
    if (!menu) return;

    menu.classList.toggle('active');

    document.removeEventListener('click', handleOutsideClick);
    if (menu.classList.contains('active')) {
        document.addEventListener('click', handleOutsideClick);
    }
}

function handleOutsideClick(e) {
    if (!e.target.closest('.profile-dropdown')) {
        const menu = document.getElementById('profileMenu');
        if (menu) menu.classList.remove('active');
        document.removeEventListener('click', handleOutsideClick);
    }
}

// auth.js must provide:
// getCurrentUser()
// logout()
