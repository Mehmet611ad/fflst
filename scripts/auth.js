// Authentication module
const Auth = {
    // Initialize authentication event listeners
    init() {
        // Tab switching
        const loginTab = document.getElementById('login-tab');
        const registerTab = document.getElementById('register-tab');
        const loginForm = document.getElementById('login-form');
        const registerForm = document.getElementById('register-form');
        
        if (loginTab && registerTab) {
            loginTab.addEventListener('click', () => this.switchTab('login'));
            registerTab.addEventListener('click', () => this.switchTab('register'));
        }
        
        // Form submissions
        if (loginForm) {
            loginForm.addEventListener('submit', (e) => this.handleLogin(e));
        }
        
        if (registerForm) {
            registerForm.addEventListener('submit', (e) => this.handleRegister(e));
        }
    },
    
    // Switch between login and register tabs
    switchTab(tab) {
        const loginTab = document.getElementById('login-tab');
        const registerTab = document.getElementById('register-tab');
        const loginForm = document.getElementById('login-form');
        const registerForm = document.getElementById('register-form');
        
        if (tab === 'login') {
            loginTab.classList.add('active');
            registerTab.classList.remove('active');
            loginForm.classList.remove('hidden');
            registerForm.classList.add('hidden');
            this.clearErrors();
        } else {
            registerTab.classList.add('active');
            loginTab.classList.remove('active');
            registerForm.classList.remove('hidden');
            loginForm.classList.add('hidden');
            this.clearErrors();
        }
    },
    
    // Handle login form submission
    async handleLogin(e) {
        e.preventDefault();
        
        const email = document.getElementById('login-email').value;
        const password = document.getElementById('login-password').value;
        
        try {
            this.toggleSubmitButton('login-form', true);
            const response = await API.login(email, password);
            
            if (response.success) {
                // Store user data in localStorage
                localStorage.setItem('currentUser', JSON.stringify(response.user));
                this.clearErrors();
                this.redirectToDashboard();
            }
        } catch (error) {
            this.showError('login-error', error.message);
        } finally {
            this.toggleSubmitButton('login-form', false);
        }
    },
    
    // Handle registration form submission
    async handleRegister(e) {
        e.preventDefault();
        
        const name = document.getElementById('register-name').value;
        const email = document.getElementById('register-email').value;
        const password = document.getElementById('register-password').value;
        const confirmPassword = document.getElementById('register-confirm-password').value;
        
        // Validate passwords match
        if (password !== confirmPassword) {
            this.showError('register-error', 'Passwords do not match');
            return;
        }
        
        try {
            this.toggleSubmitButton('register-form', true);
            const response = await API.register(name, email, password);
            
            if (response.success) {
                // Show success message and switch to login
                this.showSuccess('Account created successfully! Please login.');
                this.switchTab('login');
                // Clear registration form
                document.getElementById('register-form').reset();
            }
        } catch (error) {
            this.showError('register-error', error.message);
        } finally {
            this.toggleSubmitButton('register-form', false);
        }
    },
    
    // Toggle submit button disabled state
    toggleSubmitButton(formId, disable) {
        const form = document.getElementById(formId);
        const button = form.querySelector('button[type="submit"]');
        if (button) {
            button.disabled = disable;
        }
    },
    
    // Show error message
    showError(elementId, message) {
        const errorElement = document.getElementById(elementId);
        if (errorElement) {
            errorElement.textContent = message;
            errorElement.classList.remove('hidden');
        }
    },
    
    // Clear all error messages
    clearErrors() {
        const errorElements = document.querySelectorAll('.error-message');
        errorElements.forEach(el => {
            el.textContent = '';
            el.classList.add('hidden');
        });
    },
    
    // Show success message
    showSuccess(message) {
        const toast = document.getElementById('toast');
        const toastMessage = document.getElementById('toast-message');
        if (toast && toastMessage) {
            toastMessage.textContent = message;
            toast.classList.remove('hidden');
            toast.classList.add('show');
            
            // Hide toast after 3 seconds
            setTimeout(() => {
                toast.classList.add('hidden');
                toast.classList.remove('show');
            }, 3000);
        }
    },
    
    // Redirect to dashboard
    redirectToDashboard() {
        window.location.hash = '#dashboard';
        location.reload();
    },
    
    // Check if user is authenticated
    isAuthenticated() {
        const currentUser = localStorage.getItem('currentUser');
        return currentUser !== null;
    },
    
    // Get current user
    getCurrentUser() {
        const currentUser = localStorage.getItem('currentUser');
        return currentUser ? JSON.parse(currentUser) : null;
    },
    
    // Logout user
    logout() {
        localStorage.removeItem('currentUser');
        window.location.hash = '';
        location.reload();
    }
};