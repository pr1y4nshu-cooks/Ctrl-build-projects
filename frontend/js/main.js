// Main Application Entry Point
const API_BASE_URL = 'http://localhost:8000';

// Simple Router
class Router {
    constructor() {
        this.routes = {};
        this.currentRoute = null;
    }

    register(path, handler) {
        this.routes[path] = handler;
    }

    navigate(path) {
        if (this.routes[path]) {
            this.currentRoute = path;
            this.routes[path]();
        }
    }
}

// Initialize Router
const router = new Router();

// Load Home Page
async function loadHome() {
    const app = document.getElementById('app');
    const response = await fetch('pages/home.html');
    const html = await response.text();
    app.innerHTML = html;
}

// Load Dashboard Page
async function loadDashboard() {
    const app = document.getElementById('app');
    const response = await fetch('pages/dashboard.html');
    const html = await response.text();
    app.innerHTML = html;
}

// Load Conflicts Page
async function loadConflicts() {
    const app = document.getElementById('app');
    const response = await fetch('pages/conflicts.html');
    const html = await response.text();
    app.innerHTML = html;
}

// Load Login Page
async function loadLogin() {
    const app = document.getElementById('app');
    const response = await fetch('pages/login.html');
    const html = await response.text();
    app.innerHTML = html;
}

// Register Routes
router.register('/', loadHome);
router.register('/dashboard', loadDashboard);
router.register('/conflicts', loadConflicts);
router.register('/login', loadLogin);

// Handle hash changes
window.addEventListener('hashchange', () => {
    const path = window.location.hash.slice(1) || '/';
    router.navigate(path);
});

// Initialize App
document.addEventListener('DOMContentLoaded', () => {
    const path = window.location.hash.slice(1) || '/';
    router.navigate(path);
});

// Make router globally available
window.router = router;
