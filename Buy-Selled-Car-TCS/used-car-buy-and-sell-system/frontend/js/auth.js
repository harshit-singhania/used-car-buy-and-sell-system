/* Shared localStorage keys */
const USERS_KEY        = 'ucm_users';
const CURRENT_USER_KEY = 'ucm_currentUser';

/* ─── Storage helpers ─────────────────────────────────── */

function getUsers() {
  return JSON.parse(localStorage.getItem(USERS_KEY)) || [];
}

function saveUsers(users) {
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
}

function getCurrentUser() {
  return JSON.parse(localStorage.getItem(CURRENT_USER_KEY));
}

function setCurrentUser(user) {
  localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(user));
}

function clearCurrentUser() {
  localStorage.removeItem(CURRENT_USER_KEY);
}

/* ─── Inline field error helpers ─────────────────────── */

function showFieldError(fieldId, message) {
  const input = document.getElementById(fieldId);
  const errEl = document.getElementById(fieldId + '-error');
  if (input)  input.classList.add('is-error');
  if (errEl)  { errEl.textContent = message; errEl.classList.add('visible'); }
}

function clearFieldError(fieldId) {
  const input = document.getElementById(fieldId);
  const errEl = document.getElementById(fieldId + '-error');
  if (input)  input.classList.remove('is-error');
  if (errEl)  { errEl.textContent = ''; errEl.classList.remove('visible'); }
}

function clearAllFieldErrors(ids) {
  ids.forEach(clearFieldError);
}

/* ─── Banner alert helpers ────────────────────────────── */

function showAlert(alertId, message) {
  const el = document.getElementById(alertId);
  if (!el) return;
  el.textContent = message;
  el.classList.add('visible');
}

function hideAlert(alertId) {
  const el = document.getElementById(alertId);
  if (el) el.classList.remove('visible');
}

/* ─── Demo seed users ─────────────────────────────────── */

function seedUsersIfEmpty() {
  const existing = getUsers();
  const hasDemoBuyer  = existing.some(u => u.userId === 'demoBuyer');
  const hasDemoSeller = existing.some(u => u.userId === 'demoSeller');
  const hasDemoAdmin  = existing.some(u => u.userId === 'demoAdmin');

  const toAdd = [];

  if (!hasDemoBuyer) {
    toAdd.push({
      id:               'USR_DEMO_BUYER',
      userId:           'demoBuyer',
      fullName:         'Arjun Mehta',
      email:            'arjun.mehta@demo.com',
      phone:            '+919876543210',
      city:             'Mumbai',
      role:             'Buyer',
      password:         'Demo@1234',
      registrationDate: '2026-01-15T08:00:00.000Z'
    });
  }

  if (!hasDemoSeller) {
    toAdd.push({
      id:               'SELLER_DEMO_1',
      userId:           'demoSeller',
      fullName:         'Priya Sharma',
      email:            'priya.sharma@demo.com',
      phone:            '+919988776655',
      city:             'Delhi',
      role:             'Seller',
      password:         'Demo@1234',
      registrationDate: '2025-11-10T09:30:00.000Z'
    });
  }

  if (!hasDemoAdmin) {
    toAdd.push({
      id:               'ADMIN_DEMO_1',
      userId:           'demoAdmin',
      fullName:         'System Admin',
      email:            'admin@demo.com',
      phone:            '+919900000001',
      city:             'Bangalore',
      role:             'Admin',
      password:         'Admin@1234',
      registrationDate: '2025-10-01T10:00:00.000Z'
    });
  }

  if (toAdd.length) {
    saveUsers(existing.concat(toAdd));
  }
}

/* ─── Validators ──────────────────────────────────────── */

const validators = {
  fullName(value) {
    if (!value) return 'Full Name is required';
    if (!/^[A-Za-z ]{1,50}$/.test(value)) return 'Name must contain only letters and spaces (max 50 characters)';
    return null;
  },
  email(value) {
    if (!value) return 'Email address is required';
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) return 'Please enter a valid email address';
    return null;
  },
  mobile(value) {
    if (!value) return 'Mobile number is required';
    if (!/^\d{10}$/.test(value)) return 'Mobile number must be exactly 10 digits';
    return null;
  },
  userId(value) {
    if (!value) return 'User ID is required';
    if (!/^[A-Za-z0-9]{5,20}$/.test(value)) return 'User ID must be 5–20 alphanumeric characters (no spaces or symbols)';
    return null;
  },
  password(value) {
    if (!value) return 'Password is required';
    if (value.length < 8) return 'Password must be at least 8 characters';
    if (!/[A-Z]/.test(value)) return 'Password must contain at least one uppercase letter';
    if (!/[a-z]/.test(value)) return 'Password must contain at least one lowercase letter';
    if (!/[0-9]/.test(value)) return 'Password must contain at least one digit';
    if (!/[!@#$%^&*()\-_=+\[\]{};:'",.<>?/\\|`~]/.test(value)) return 'Password must contain at least one special character';
    return null;
  },
  confirmPassword(value, original) {
    if (!value) return 'Please confirm your password';
    if (value !== original) return 'Passwords do not match';
    return null;
  }
};