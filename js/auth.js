/**
 * UNIQUE COLLECTION - Client Authentication Module (Step 6)
 * Handles frontend demo registration, login, user profile, protected routes,
 * and header state synchronization using localStorage.
 * 
 * SECURITY NOTE (DEMO ONLY):
 * This is a client-side frontend demonstration with no server-side backend or database.
 * Real credentials, encrypted passwords, and secure tokens must be handled securely
 * by a backend authentication service in production.
 */

(function () {
  'use strict';

  const USERS_STORAGE_KEY = 'unique_collection_users';
  const AUTH_STORAGE_KEY = 'unique_collection_user';

  // Default seed account to facilitate immediate testing if no accounts exist
  const DEFAULT_SEED_USER = {
    id: 'USR-demo-client',
    fullName: 'Syeda Fathima',
    email: 'demo@uniquecollection.com',
    mobile: '9941602630',
    password: 'password123',
    createdAt: new Date().toISOString()
  };

  const AuthService = {
    /**
     * Retrieve all registered demo accounts from localStorage
     * Seeds a default demo user if storage is empty
     * @returns {Array<Object>}
     */
    getUsers: function () {
      try {
        const raw = localStorage.getItem(USERS_STORAGE_KEY);
        if (!raw) {
          const initialUsers = [DEFAULT_SEED_USER];
          localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(initialUsers));
          return initialUsers;
        }
        return JSON.parse(raw);
      } catch (err) {
        console.error('Error reading users from localStorage:', err);
        return [DEFAULT_SEED_USER];
      }
    },

    /**
     * Persist user accounts to localStorage
     * @param {Array<Object>} users
     */
    saveUsers: function (users) {
      try {
        localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(users));
      } catch (err) {
        console.error('Error saving users to localStorage:', err);
      }
    },

    /**
     * Check if a customer is currently authenticated
     * @returns {boolean}
     */
    isAuthenticated: function () {
      return !!this.getCurrentUser();
    },

    /**
     * Retrieve the currently logged-in demo customer session
     * @returns {Object|null}
     */
    getCurrentUser: function () {
      try {
        const raw = localStorage.getItem(AUTH_STORAGE_KEY);
        return raw ? JSON.parse(raw) : null;
      } catch (err) {
        console.error('Error reading auth state:', err);
        return null;
      }
    },

    /**
     * Set the currently logged-in demo customer
     * @param {Object} user
     */
    setCurrentUser: function (user) {
      try {
        if (!user) {
          localStorage.removeItem(AUTH_STORAGE_KEY);
        } else {
          localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(user));
        }
        this.updateHeaderAuthUI();
      } catch (err) {
        console.error('Error setting current user:', err);
      }
    },

    /**
     * Register a new customer demo account
     * @param {Object} userData - { fullName, email, mobile, password }
     * @returns {{ success: boolean, message?: string, user?: Object }}
     */
    register: function (userData) {
      const email = (userData.email || '').trim().toLowerCase();
      const mobile = (userData.mobile || '').trim();
      const fullName = (userData.fullName || '').trim();
      const password = (userData.password || '').trim();

      if (!fullName || fullName.length < 2) {
        return { success: false, message: 'Please enter a valid full name (at least 2 letters).' };
      }

      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!email || !emailRegex.test(email)) {
        return { success: false, message: 'Please enter a valid email address.' };
      }

      const mobileRegex = /^[6-9]\d{9}$/;
      if (!mobile || !mobileRegex.test(mobile)) {
        return { success: false, message: 'Please enter a valid 10-digit Indian mobile number.' };
      }

      if (!password || password.length < 6) {
        return { success: false, message: 'Password must be at least 6 characters long.' };
      }

      const users = this.getUsers();

      // Prevent duplicate registration with same email (case-insensitive)
      const existingUserByEmail = users.find(u => (u.email || '').toLowerCase() === email);
      if (existingUserByEmail) {
        return {
          success: false,
          message: 'An account with this email address already exists. Please log in instead.'
        };
      }

      const newUser = {
        id: 'USR-' + Date.now().toString(36) + '-' + Math.floor(1000 + Math.random() * 9000),
        fullName: fullName,
        email: email,
        mobile: mobile,
        password: password,
        createdAt: new Date().toISOString()
      };

      users.push(newUser);
      this.saveUsers(users);

      // Automatically sign in the new demo user
      this.setCurrentUser(newUser);

      return {
        success: true,
        message: 'Account created successfully! Welcome to UNIQUE COLLECTION.',
        user: newUser
      };
    },

    /**
     * Log in a customer using email or 10-digit mobile number and password
     * @param {string} identifier - Email or mobile number
     * @param {string} password - User password
     * @returns {{ success: boolean, message?: string, user?: Object }}
     */
    login: function (identifier, password) {
      const cleanId = (identifier || '').trim().toLowerCase();
      const cleanPass = (password || '').trim();

      if (!cleanId) {
        return { success: false, message: 'Please enter your email address or mobile number.' };
      }
      if (!cleanPass) {
        return { success: false, message: 'Please enter your password.' };
      }

      const users = this.getUsers();

      // Match either email or 10-digit mobile
      const user = users.find(u => {
        const emailMatch = (u.email || '').toLowerCase() === cleanId;
        const mobileMatch = (u.mobile || '').replace(/\D/g, '') === cleanId.replace(/\D/g, '');
        return emailMatch || mobileMatch;
      });

      if (!user) {
        return {
          success: false,
          message: 'No account found with this email or mobile number. Please check or register.'
        };
      }

      if (user.password !== cleanPass) {
        return {
          success: false,
          message: 'Incorrect password. Please verify your password and try again.'
        };
      }

      // Valid credentials -> set session
      this.setCurrentUser(user);

      return {
        success: true,
        message: `Welcome back, ${user.fullName}!`,
        user: user
      };
    },

    /**
     * Log out current customer and redirect if currently on a protected page
     * @param {string} [redirectTo] - Optional redirect destination
     */
    logout: function (redirectTo) {
      localStorage.removeItem(AUTH_STORAGE_KEY);
      this.updateHeaderAuthUI();

      if (window.CartService && window.CartService.showToast) {
        window.CartService.showToast('You have been logged out.', 'info');
      }

      const isProtectedPage = window.location.pathname.includes('profile.html') ||
                              window.location.pathname.includes('my-orders.html') ||
                              window.location.pathname.includes('checkout.html');

      const isInsidePages = window.location.pathname.includes('/pages/');
      const fallbackTarget = isInsidePages ? 'login.html' : 'pages/login.html';
      const target = redirectTo || (isProtectedPage ? fallbackTarget : null);

      if (target) {
        setTimeout(() => {
          window.location.href = target;
        }, 300);
      } else {
        // Refresh current page to update header UI
        setTimeout(() => {
          window.location.reload();
        }, 300);
      }
    },

    /**
     * Update current customer's profile (name and mobile)
     * @param {Object} updatedData - { fullName, mobile }
     * @returns {{ success: boolean, message?: string, user?: Object }}
     */
    updateProfile: function (updatedData) {
      const currentUser = this.getCurrentUser();
      if (!currentUser) {
        return { success: false, message: 'You must be logged in to update your profile.' };
      }

      const newName = (updatedData.fullName || '').trim();
      const newMobile = (updatedData.mobile || '').trim();

      if (!newName || newName.length < 2) {
        return { success: false, message: 'Please enter a valid full name (at least 2 letters).' };
      }

      const mobileRegex = /^[6-9]\d{9}$/;
      if (!newMobile || !mobileRegex.test(newMobile)) {
        return { success: false, message: 'Please enter a valid 10-digit Indian mobile number.' };
      }

      currentUser.fullName = newName;
      currentUser.mobile = newMobile;

      // Update in stored users array
      const users = this.getUsers();
      const idx = users.findIndex(u => u.id === currentUser.id || u.email.toLowerCase() === currentUser.email.toLowerCase());
      if (idx !== -1) {
        users[idx].fullName = newName;
        users[idx].mobile = newMobile;
        this.saveUsers(users);
      }

      // Update current session
      this.setCurrentUser(currentUser);

      return {
        success: true,
        message: 'Your profile details have been successfully updated.',
        user: currentUser
      };
    },

    /**
     * Protect page route: redirect unauthenticated users to login with redirect parameter
     * @param {string} [intendedPage] - Target page filename or path
     * @returns {boolean} - true if authenticated, false if redirecting
     */
    requireAuth: function (intendedPage) {
      if (this.isAuthenticated()) {
        return true;
      }

      const isInsidePages = window.location.pathname.includes('/pages/');
      const currentFile = intendedPage || window.location.pathname.split('/').pop() || 'index.html';
      const loginUrl = isInsidePages ? 'login.html' : 'pages/login.html';
      const redirectParam = encodeURIComponent(currentFile);

      window.location.href = `${loginUrl}?redirect=${redirectParam}`;
      return false;
    },

    /**
     * Read the intended redirect target from URL search params
     * @param {string} defaultTarget - Fallback target if none provided
     * @returns {string}
     */
    getRedirectTarget: function (defaultTarget) {
      const params = new URLSearchParams(window.location.search);
      const redirect = params.get('redirect');
      if (redirect) {
        // Prevent open redirect security vulnerabilities: only permit relative internal files
        const cleanRedirect = decodeURIComponent(redirect).replace(/^(\/\/|https?:\/\/)/i, '');
        return cleanRedirect;
      }
      return defaultTarget || (window.location.pathname.includes('/pages/') ? '../index.html' : 'index.html');
    },

    /**
     * Synchronize header authentication UI elements across all pages
     */
    updateHeaderAuthUI: function () {
      const currentUser = this.getCurrentUser();
      const isInsidePages = window.location.pathname.includes('/pages/') || window.location.href.includes('/pages/');
      const profileHref = isInsidePages ? 'profile.html' : 'pages/profile.html';
      const ordersHref = isInsidePages ? 'my-orders.html' : 'pages/my-orders.html';
      const wishlistHref = isInsidePages ? 'wishlist.html' : 'pages/wishlist.html';
      const cartHref = isInsidePages ? 'cart.html' : 'pages/cart.html';
      const loginHref = isInsidePages ? 'login.html' : 'pages/login.html';
      const registerHref = isInsidePages ? 'register.html' : 'pages/register.html';

      // 1. Desktop Account Action Button & Dropdown Menu
      const accountBtns = document.querySelectorAll('.header-actions a[aria-label*="Login"], .header-actions a[aria-label*="Account"], .header-actions a[aria-label*="Profile"], .header-actions a[href*="login.html"], .header-actions a[href*="profile.html"]');
      accountBtns.forEach(btn => {
        let wrapper = btn.closest('.account-action-wrapper');
        if (!wrapper && btn.parentNode) {
          wrapper = document.createElement('div');
          wrapper.className = 'account-action-wrapper';
          btn.parentNode.insertBefore(wrapper, btn);
          wrapper.appendChild(btn);
        }

        if (!wrapper) return;

        // Clear existing dropdown if present
        let dropdown = wrapper.querySelector('.account-dropdown-menu');
        if (dropdown) dropdown.remove();

        dropdown = document.createElement('div');
        dropdown.className = 'account-dropdown-menu';

        if (currentUser) {
          btn.href = profileHref;
          btn.setAttribute('aria-label', `Account Profile: ${currentUser.fullName}`);
          btn.setAttribute('title', `Account Profile: ${currentUser.fullName}`);
          btn.classList.add('user-logged-in');

          if (!btn.querySelector('.auth-status-dot')) {
            const dot = document.createElement('span');
            dot.className = 'auth-status-dot';
            btn.appendChild(dot);
          }

          dropdown.innerHTML = `
            <div class="account-dropdown-header">
              <span>Signed in as</span>
              <strong>${currentUser.fullName}</strong>
            </div>
            <ul class="account-dropdown-list">
              <li>
                <a href="${profileHref}" class="account-dropdown-item">
                  <span>👤</span> My Profile
                </a>
              </li>
              <li>
                <a href="${ordersHref}" class="account-dropdown-item">
                  <span>📦</span> My Orders
                </a>
              </li>
              <li>
                <a href="${wishlistHref}" class="account-dropdown-item">
                  <span>♡</span> My Wishlist
                </a>
              </li>
              <li>
                <a href="${cartHref}" class="account-dropdown-item">
                  <span>🛍️</span> Shopping Cart
                </a>
              </li>
              <li>
                <a href="javascript:void(0)" class="account-dropdown-item item-logout" id="header-btn-logout">
                  <span>🚪</span> Log Out
                </a>
              </li>
            </ul>
          `;

          const logoutBtn = dropdown.querySelector('#header-btn-logout');
          if (logoutBtn) {
            logoutBtn.addEventListener('click', (e) => {
              e.preventDefault();
              AuthService.logout();
            });
          }
        } else {
          btn.href = loginHref;
          btn.setAttribute('aria-label', 'Customer Login');
          btn.setAttribute('title', 'Customer Login');
          btn.classList.remove('user-logged-in');
          const dot = btn.querySelector('.auth-status-dot');
          if (dot) dot.remove();

          dropdown.innerHTML = `
            <div class="account-dropdown-header">
              <span>Welcome to UNIQUE COLLECTION</span>
              <strong>Sign In or Register</strong>
            </div>
            <ul class="account-dropdown-list">
              <li>
                <a href="${loginHref}" class="account-dropdown-item">
                  <span>🔑</span> Sign In
                </a>
              </li>
              <li>
                <a href="${registerHref}" class="account-dropdown-item">
                  <span>✨</span> Create Account
                </a>
              </li>
              <li>
                <a href="${ordersHref}" class="account-dropdown-item">
                  <span>📦</span> Track Orders
                </a>
              </li>
              <li>
                <a href="${wishlistHref}" class="account-dropdown-item">
                  <span>♡</span> My Wishlist
                </a>
              </li>
            </ul>
          `;
        }

        wrapper.appendChild(dropdown);
      });

      // 2. Mobile Drawer Navigation Links
      const mobileNavLinks = document.querySelectorAll('.mobile-menu-link');
      mobileNavLinks.forEach(link => {
        const href = link.getAttribute('href') || '';
        const text = link.textContent.trim().toLowerCase();

        if (href.includes('login.html') || href.includes('profile.html') || text.includes('login') || text.includes('account')) {
          const parentLi = link.closest('.mobile-menu-item');
          if (!parentLi) return;

          if (currentUser) {
            // Render Profile, My Orders, and Logout items in mobile drawer
            link.href = profileHref;
            link.innerHTML = `<span>👤</span> My Profile (${currentUser.fullName.split(' ')[0]})`;

            // Check if My Orders & Logout are already added
            let ordersLi = parentLi.parentElement.querySelector('.mobile-my-orders-item');
            if (!ordersLi) {
              ordersLi = document.createElement('li');
              ordersLi.className = 'mobile-menu-item mobile-my-orders-item';
              ordersLi.innerHTML = `<a href="${ordersHref}" class="mobile-menu-link"><span>📦</span> My Orders</a>`;
              parentLi.insertAdjacentElement('afterend', ordersLi);
            }

            let logoutLi = parentLi.parentElement.querySelector('.mobile-logout-item');
            if (!logoutLi) {
              logoutLi = document.createElement('li');
              logoutLi.className = 'mobile-menu-item mobile-logout-item';
              logoutLi.innerHTML = `<a href="javascript:void(0)" class="mobile-menu-link text-logout" id="mobile-btn-logout"><span>🚪</span> Log Out</a>`;
              if (ordersLi) {
                ordersLi.insertAdjacentElement('afterend', logoutLi);
              } else {
                parentLi.insertAdjacentElement('afterend', logoutLi);
              }
              const logoutBtn = logoutLi.querySelector('#mobile-btn-logout');
              if (logoutBtn) {
                logoutBtn.addEventListener('click', (e) => {
                  e.preventDefault();
                  AuthService.logout();
                });
              }
            }
          } else {
            link.href = loginHref;
            link.innerHTML = `Login / Register`;
            const ordersLi = parentLi.parentElement.querySelector('.mobile-my-orders-item');
            if (ordersLi) ordersLi.remove();
            const logoutLi = parentLi.parentElement.querySelector('.mobile-logout-item');
            if (logoutLi) logoutLi.remove();
          }
        }
      });

      // 3. Footer Login Links
      const footerLoginLinks = document.querySelectorAll('.footer-links a[href*="login.html"], .footer-links a[href*="profile.html"]');
      footerLoginLinks.forEach(link => {
        if (currentUser) {
          link.href = profileHref;
          link.textContent = 'My Profile & Account';
        } else {
          link.href = loginHref;
          link.textContent = 'Account Login';
        }
      });
    }
  };

  // Expose to window
  window.AuthService = AuthService;

  // Sync header auth UI when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      AuthService.updateHeaderAuthUI();
    });
  } else {
    AuthService.updateHeaderAuthUI();
  }
})();
