'use strict';

const API_BASE = 'http://localhost:5000/api';

// ── Token helpers ──────────────────────────────
function getToken()        { return localStorage.getItem('mn_token'); }
function setToken(t)       { localStorage.setItem('mn_token', t); }
function removeToken()     { localStorage.removeItem('mn_token'); }
function getUser()         { return JSON.parse(localStorage.getItem('mn_user') || 'null'); }
function setUser(u)        { localStorage.setItem('mn_user', JSON.stringify(u)); }
function removeUser()      { localStorage.removeItem('mn_user'); }

// ── Core fetch wrapper ─────────────────────────
async function api(method, endpoint, body = null, isForm = false) {
  const headers = {};
  const token   = getToken();
  if (token) headers['Authorization'] = `Bearer ${token}`;
  if (!isForm && body) headers['Content-Type'] = 'application/json';

  const options = { method, headers, credentials: 'include' };
  if (body) options.body = isForm ? body : JSON.stringify(body);

  const res  = await fetch(`${API_BASE}${endpoint}`, options);
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw { status: res.status, message: data.message || 'Something went wrong.' };
  return data;
}

// ── Auth guards ────────────────────────────────
function requireAuth(role) {
  const user = getUser();
  if (!user || !getToken()) {
    window.location.href = roleLoginPage(role || 'donor');
    return false;
  }
  if (role && user.role !== role) {
    window.location.href = roleLoginPage(user.role);
    return false;
  }
  return true;
}

function roleLoginPage(role) {
  const map = { admin: '../login/adminLogin.html', donor: '../login/donorLogin.html', volunteer: '../login/volunteerLogin.html' };
  return map[role] || '../login/donorLogin.html';
}

function redirectToDashboard(role) {
  const map = { admin: '../dashboard/adminDashboard.html', donor: '../dashboard/donorDashboard.html', volunteer: '../dashboard/volunteerDashboard.html' };
  window.location.href = map[role] || '../index.html';
}

// ── Logout ─────────────────────────────────────
async function logout() {
  try { await api('POST', '/auth/logout'); } catch (_) {}
  removeToken(); removeUser();
  window.location.href = '../index.html';
}

// ── Show alert helper ──────────────────────────
function showAlert(type, msg, containerId = 'alertBox') {
  let el = document.getElementById(containerId);
  if (!el) {
    el = document.createElement('div');
    el.id = containerId;
    document.body.prepend(el);
  }
  el.className = `alert alert-${type === 'success' ? 'success' : 'danger'}`;
  el.textContent = msg;
  el.style.display = 'block';
  setTimeout(() => { el.style.display = 'none'; }, 4000);
}
