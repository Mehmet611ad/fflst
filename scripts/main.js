// Main application entry point
document.addEventListener('DOMContentLoaded', () => {
    // Initialize the application based on the current view
    initializeApp();
});

// Initialize the application
function initializeApp() {
    // Check if we're on the dashboard or auth page
    const hash = window.location.hash;
    
    if (hash === '#dashboard' && Auth.isAuthenticated()) {
        // Show dashboard
        showDashboard();
        Dashboard.init();
    } else {
        // Show authentication
        showAuth();
        Auth.init();
    }
}

// Show authentication section
function showAuth() {
    const authSection = document.getElementById('auth-section');
    const dashboardSection = document.getElementById('dashboard-section');
    
    if (authSection) {
        authSection.classList.remove('hidden');
    }
    
    if (dashboardSection) {
        dashboardSection.classList.add('hidden');
    }
}

// Show dashboard section
function showDashboard() {
    const authSection = document.getElementById('auth-section');
    const dashboardSection = document.getElementById('dashboard-section');
    
    if (authSection) {
        authSection.classList.add('hidden');
    }
    
    if (dashboardSection) {
        dashboardSection.classList.remove('hidden');
    }
}

// Initialize app when the page loads
window.addEventListener('load', () => {
    initializeApp();
});

// Handle hash changes (for navigation)
window.addEventListener('hashchange', () => {
    initializeApp();
});