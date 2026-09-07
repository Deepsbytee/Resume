const API_URL = 'http://localhost:3000/api';
document.addEventListener('DOMContentLoaded', () => {
    checkAuthStatus();
});

function switchTab(tab) {
    document.getElementById('login-container').classList.add('hidden');
    document.getElementById('register-container').classList.add('hidden');
    
    if (tab === 'login') {
        document.getElementById('login-container').classList.remove('hidden');
    } else {
        document.getElementById('register-container').classList.remove('hidden');
    }
}

function toggleVisibility(inputId) {
    const input = document.getElementById(inputId);
    if (input.type === 'password') {
        input.type = 'text';
    } else {
        input.type = 'password';
    }
}


function showToast(message, type = 'success') {
    const toast = document.getElementById('toast');
    toast.textContent = message;
    
    toast.className = 'toast show';
    toast.classList.add(type);

 
    setTimeout(() => {
        toast.className = 'toast hidden';
    }, 3000);
}


function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(String(email).toLowerCase());
}

document.getElementById('register-form').addEventListener('submit', async (e) => {
    e.preventDefault();

    const username = document.getElementById('reg-username').value;
    const email = document.getElementById('reg-email').value;
    const password = document.getElementById('reg-password').value;

    if (!validateEmail(email)) return showToast('Invalid email format', 'error');
    if (password.length < 6) return showToast('Password must be 6+ characters', 'error');

    try {
        const response = await fetch(`${API_URL}/auth/register`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, email, password })
        });

        const data = await response.json();
        
        if (data.success) {
            showToast(data.message, 'success');
            document.getElementById('register-form').reset();
            switchTab('login'); 
        } else {
            showToast(data.message, 'error');
        }
    } catch (error) {
        showToast('Cannot connect to the backend server.', 'error');
    }
});

document.getElementById('login-form').addEventListener('submit', async (e) => {
    e.preventDefault(); 

    const email = document.getElementById('login-email').value;
    const password = document.getElementById('login-password').value;
    const rememberMe = document.getElementById('remember-me').checked;

    try {
        const response = await fetch(`${API_URL}/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password, rememberMe })
        });

        const data = await response.json();
        
        if (data.success) {
            showToast(data.message, 'success');
            
            localStorage.setItem('authToken', data.token);
            
            checkAuthStatus(); 
        } else {
            showToast(data.message, 'error');
        }
    } catch (error) {
        showToast('Cannot connect to server.', 'error');
    }
});

async function checkAuthStatus() {
    const token = localStorage.getItem('authToken');

    if (!token) {
        
        document.getElementById('dashboard-container').classList.add('hidden');
        document.getElementById('login-container').classList.remove('hidden');
        return;
    }

    try {
        const response = await fetch(`${API_URL}/user/dashboard`, {
            method: 'GET',
            headers: { 'Authorization': `Bearer ${token}` }
        });
        
        const data = await response.json();

        if (data.success) {
            document.getElementById('login-container').classList.add('hidden');
            document.getElementById('register-container').classList.add('hidden');
            document.getElementById('dashboard-container').classList.remove('hidden');

            document.getElementById('dashboard-greeting').textContent = `Hello, ${data.user.username}!`;
            document.getElementById('dash-username').textContent = data.user.username;
        } else {
            localStorage.removeItem('authToken');
            checkAuthStatus();
            showToast('Session expired. Please login again.', 'error');
        }
    } catch (error) {
        showToast('Server connection failed.', 'error');
    }
}

function logout() {
    localStorage.removeItem('authToken'); 
    showToast('Logged out successfully', 'success');
    
    document.getElementById('login-form').reset();
    
    checkAuthStatus(); 
}
