const API_URL = '/api';

// ---- Landing Page Navigation ----

function irAAuth(tab) {
    document.getElementById('landing-section').classList.add('hidden');
    const authPage = document.getElementById('auth-page');
    authPage.classList.remove('hidden');
    // Re-trigger entrance animation
    authPage.style.animation = 'none';
    authPage.offsetHeight; // force reflow
    authPage.style.animation = '';
    
    if (tab === 'register') {
        mostrarTab('register');
    } else {
        mostrarTab('login');
    }
    window.scrollTo(0, 0);
}

function volverALanding() {
    document.getElementById('auth-page').classList.add('hidden');
    const landing = document.getElementById('landing-section');
    landing.classList.remove('hidden');
    window.scrollTo(0, 0);
    limpiarMensaje();
}


function mostrarLoading() {
    document.getElementById('loading-overlay').classList.remove('hidden');
}

function ocultarLoading() {
    document.getElementById('loading-overlay').classList.add('hidden');
}

function togglePassword(inputId, btn) {
    const input = document.getElementById(inputId);
    if (input.type === 'password') {
        input.type = 'text';
        btn.classList.add('active');
    } else {
        input.type = 'password';
        btn.classList.remove('active');
    }
}

function mostrarTab(tab) {
    const loginForm = document.getElementById('login-form');
    const registerForm = document.getElementById('register-form');
    const tabs = document.querySelectorAll('.tab');

    tabs.forEach(t => t.classList.remove('active'));

    if (tab === 'login') {
        loginForm.classList.remove('hidden');
        registerForm.classList.add('hidden');
        tabs[0].classList.add('active');
    } else {
        loginForm.classList.add('hidden');
        registerForm.classList.remove('hidden');
        tabs[1].classList.add('active');
    }

    limpiarMensaje();
}

function mostrarMensaje(texto, tipo) {
    const div = document.getElementById('mensaje');
    div.textContent = texto;
    div.className = 'mensaje ' + tipo;
}

function limpiarMensaje() {
    const div = document.getElementById('mensaje');
    div.textContent = '';
    div.className = 'mensaje';
}

async function handleLogin(e) {
    e.preventDefault();

    const email = document.getElementById('login-email').value;
    const password = document.getElementById('login-password').value;

    mostrarLoading();

    try {
        const res = await fetch(API_URL + '/auth/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password })
        });

        const data = await res.json();

        if (!res.ok) {
            ocultarLoading();
            mostrarMensaje(data.mensaje || 'Error al iniciar sesion', 'error');
            return;
        }

        localStorage.setItem('token', data.token);
        localStorage.setItem('username', data.username);
        window.location.href = '/dashboard.html';
    } catch (error) {
        ocultarLoading();
        mostrarMensaje('Error de conexion con el servidor', 'error');
    }
}

async function handleRegister(e) {
    e.preventDefault();

    const username = document.getElementById('reg-username').value;
    const email = document.getElementById('reg-email').value;
    const password = document.getElementById('reg-password').value;
    const confirmPassword = document.getElementById('reg-password-confirm').value;

    if (password !== confirmPassword) {
        mostrarMensaje('Las contraseñas no coinciden', 'error');
        return;
    }

    mostrarLoading();

    try {
        const res = await fetch(API_URL + '/auth/register', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, email, password })
        });

        const data = await res.json();

        if (!res.ok) {
            ocultarLoading();
            const msg = data.errores
                ? data.errores.map(e => e.msg).join(', ')
                : data.mensaje || 'Error al registrarse';
            mostrarMensaje(msg, 'error');
            return;
        }

        localStorage.setItem('token', data.token);
        localStorage.setItem('username', data.username);
        window.location.href = '/dashboard.html';
    } catch (error) {
        ocultarLoading();
        mostrarMensaje('Error de conexion con el servidor', 'error');
    }
}
