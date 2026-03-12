// ========================================
// Account Authentication (localStorage)
// ========================================
(function () {
    'use strict';

    const AUTH_KEY = 'ip_auth_user';
    const USERS_KEY = 'ip_users';

    // ── Helpers ──
    function getUsers() {
        try { return JSON.parse(localStorage.getItem(USERS_KEY)) || []; } catch { return []; }
    }
    function saveUsers(users) { localStorage.setItem(USERS_KEY, JSON.stringify(users)); }
    function getCurrentUser() {
        try { return JSON.parse(localStorage.getItem(AUTH_KEY)); } catch { return null; }
    }
    function setCurrentUser(user) { localStorage.setItem(AUTH_KEY, JSON.stringify(user)); }
    function hashPassword(pw) {
        let h = 0;
        for (let i = 0; i < pw.length; i++) { h = ((h << 5) - h) + pw.charCodeAt(i); h |= 0; }
        return 'h_' + Math.abs(h).toString(36);
    }

    // ── Redirect if already logged in ──
    const user = getCurrentUser();
    if (user && window.location.pathname.includes('account.html')) {
        window.location.href = 'my-trips.html';
        return;
    }

    document.addEventListener('DOMContentLoaded', () => {
        // ── Tab switching ──
        document.querySelectorAll('.auth-tab').forEach(tab => {
            tab.addEventListener('click', () => {
                document.querySelectorAll('.auth-tab').forEach(t => t.classList.remove('active'));
                tab.classList.add('active');
                const isLogin = tab.dataset.tab === 'login';
                document.getElementById('loginForm').style.display = isLogin ? '' : 'none';
                document.getElementById('registerForm').style.display = isLogin ? 'none' : '';
                document.querySelector('.auth-header h1').textContent = isLogin ? 'Welcome Back' : 'Create Account';
                document.querySelector('.auth-header p').textContent = isLogin
                    ? 'Sign in to manage your trips and memories'
                    : 'Start your journey with Itinerant Pixels';
            });
        });

        // ── Login ──
        document.getElementById('loginForm').addEventListener('submit', function (e) {
            e.preventDefault();
            const email = document.getElementById('loginEmail').value.trim().toLowerCase();
            const password = document.getElementById('loginPassword').value;
            const errEl = document.getElementById('loginError');
            errEl.textContent = '';

            const users = getUsers();
            const found = users.find(u => u.email === email && u.password === hashPassword(password));
            if (!found) {
                errEl.textContent = 'Invalid email or password';
                return;
            }
            const session = { id: found.id, email: found.email, firstName: found.firstName, lastName: found.lastName, avatar: found.avatar || '' };
            setCurrentUser(session);
            window.location.href = 'my-trips.html';
        });

        // ── Register ──
        document.getElementById('registerForm').addEventListener('submit', function (e) {
            e.preventDefault();
            const firstName = document.getElementById('regFirstName').value.trim();
            const lastName = document.getElementById('regLastName').value.trim();
            const email = document.getElementById('regEmail').value.trim().toLowerCase();
            const password = document.getElementById('regPassword').value;
            const confirm = document.getElementById('regConfirm').value;
            const errEl = document.getElementById('registerError');
            errEl.textContent = '';

            if (password !== confirm) { errEl.textContent = 'Passwords do not match'; return; }
            if (password.length < 6) { errEl.textContent = 'Password must be at least 6 characters'; return; }

            const users = getUsers();
            if (users.find(u => u.email === email)) { errEl.textContent = 'An account with this email already exists'; return; }

            const newUser = {
                id: 'user_' + Date.now() + '_' + Math.random().toString(36).slice(2, 7),
                email,
                firstName,
                lastName,
                password: hashPassword(password),
                avatar: '',
                createdAt: new Date().toISOString()
            };
            users.push(newUser);
            saveUsers(users);

            const session = { id: newUser.id, email: newUser.email, firstName: newUser.firstName, lastName: newUser.lastName, avatar: '' };
            setCurrentUser(session);

            // Init empty trips for user
            localStorage.setItem('ip_trips_' + newUser.id, JSON.stringify([]));

            window.location.href = 'my-trips.html';
        });
    });

    // ── Social login placeholder ──
    window.socialLogin = function (provider) {
        alert(provider.charAt(0).toUpperCase() + provider.slice(1) + ' login coming soon!');
    };
})();
