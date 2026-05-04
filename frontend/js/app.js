/* ─── Auth guards ─────────────────────────────────── */

function requireBuyer() {
  const user = getCurrentUser();
  if (!user) { window.location.href = 'login.html'; return null; }
  if (user.role === 'Seller') { window.location.href = 'seller-dashboard.html'; return null; }
  return user;
}

function requireSeller() {
  const user = getCurrentUser();
  if (!user) { window.location.href = 'login-seller.html'; return null; }
  if (user.role !== 'Seller') { window.location.href = 'buyer-home.html'; return null; }
  return user;
}

function logoutUser() {
  const user = getCurrentUser();
  clearCurrentUser();
  window.location.href = (user && user.role === 'Seller') ? 'login-seller.html' : 'login.html';
}

/* ─── Navigation renderers ────────────────────────── */

function renderBuyerNav(activePage) {
  const links = [
    ['home',      'buyer-home.html',       'Home'],
    ['browse',    'car-listings.html',     'Browse Cars'],
    ['wishlist',  'wishlist.html',         'My Wishlist'],
    ['recent',    'recently-viewed.html',  'Recently Viewed'],
    ['purchases', 'purchase-history.html', 'My Purchases'],
    ['compare',   'compare-cars.html',     'Compare Cars'],
    ['support',   'support.html',          'Support'],
  ];
  return _buildNav(links, activePage, 'buyer-home.html');
}

function renderSellerNav(activePage) {
  const links = [
    ['dashboard', 'seller-dashboard.html', 'Dashboard'],
    ['listings',  'seller-listings.html',  'My Listings'],
    ['add',       'add-car.html',          'Add New Car'],
    ['reviews',   'seller-reviews.html',   'My Reviews'],
    ['sales',     'sales-history.html',    'Sales History'],
    ['support',   'support.html',          'Support'],
  ];
  return _buildNav(links, activePage, 'seller-dashboard.html');
}

function _buildNav(links, activePage, homeHref) {
  const items = links.map(([key, href, label]) =>
    `<li><a href="${href}"${activePage === key ? ' class="active"' : ''}>${label}</a></li>`
  ).join('');
  return `
<nav class="top-nav">
  <div class="nav-inner">
    <a href="${homeHref}" class="nav-brand">UsedCar<span>Mart</span></a>
    <ul class="nav-links">${items}</ul>
    <div class="nav-user">
      <span id="nav-welcome"></span>
      <button class="nav-logout" onclick="logoutUser()">Logout</button>
    </div>
  </div>
</nav>`;
}

/* ─── Mount nav + set welcome text ───────────────────*/

function mountNav(placeholderId, navHtml, user) {
  const el = document.getElementById(placeholderId);
  if (el) el.outerHTML = navHtml;
  const welcome = document.getElementById('nav-welcome');
  if (welcome && user) {
    welcome.textContent = user.role === 'Seller'
      ? `${user.fullName} (Seller)`
      : `Welcome, ${user.fullName}`;
  }
}

/* ─── URL helpers ──────────────────────────────────── */

function getQueryParam(name) {
  return new URLSearchParams(window.location.search).get(name);
}
