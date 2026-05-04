/* ─── Storage keys ────────────────────────────────── */
const CARS_KEY           = 'ucm_cars';
const WISHLISTS_KEY      = 'ucm_wishlists';
const REVIEWS_KEY        = 'ucm_reviews';
const PURCHASES_KEY      = 'ucm_purchases';
const COMPARE_KEY        = 'ucm_compare';
const RECENTLY_VIEWED_PFX = 'ucm_rv_';

const CURRENT_YEAR = 2026; /* Per project date context */

/* ─── Car CRUD ────────────────────────────────────── */

function getCars() {
  return JSON.parse(localStorage.getItem(CARS_KEY)) || [];
}

function saveCars(cars) {
  localStorage.setItem(CARS_KEY, JSON.stringify(cars));
}

function getCarById(id) {
  return getCars().find(c => c.id === id) || null;
}

function updateCar(updated) {
  const cars = getCars();
  const idx  = cars.findIndex(c => c.id === updated.id);
  if (idx > -1) { cars[idx] = updated; saveCars(cars); }
}

/* ─── Health score ────────────────────────────────── */

function calculateHealthScore(carYear, mileage) {
  const raw = 100 - (CURRENT_YEAR - carYear) * 3 - (mileage / 10000) * 2;
  return Math.max(0, Math.min(100, Math.round(raw)));
}

function getHealthBand(score) {
  if (score >= 70) return { label: 'Excellent', cls: 'health-green',  color: '#16a34a' };
  if (score >= 40) return { label: 'Good',      cls: 'health-yellow', color: '#d97706' };
  return               { label: 'Poor',         cls: 'health-red',    color: '#dc2626' };
}

/* ─── Fraud detection ─────────────────────────────── */

function getAveragePrice(make, year, cars) {
  const peers = cars.filter(c => c.make === make && c.year == year);
  if (peers.length === 0) return null;
  return Math.round(peers.reduce((s, c) => s + c.price, 0) / peers.length);
}

function isFraudFlagged(price, make, year, cars) {
  const avg = getAveragePrice(make, year, cars);
  return avg !== null && price < avg * 0.6; /* >40% below average */
}

/* ─── Formatting helpers ──────────────────────────── */

function formatPrice(n) {
  return '₹' + Number(n).toLocaleString('en-IN');
}

function formatDate(iso) {
  const d = new Date(iso);
  const mo = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
  return `${String(d.getDate()).padStart(2,'0')}-${mo[d.getMonth()]}-${d.getFullYear()}`;
}

/* ─── Make colour map ─────────────────────────────── */
const MAKE_COLORS = {
  'Maruti':      '#15803d', 'Hyundai':     '#1d4ed8',
  'Honda':       '#b91c1c', 'Toyota':      '#c2410c',
  'Tata':        '#0369a1', 'Mahindra':    '#7c3aed',
  'Kia':         '#0f172a', 'Ford':        '#1e40af',
  'Volkswagen':  '#1d4ed8', 'BMW':         '#0c4a6e',
  'Others':      '#475569',
};

function makeColor(make) {
  return MAKE_COLORS[make] || '#334155';
}

/* ─── Car card HTML ───────────────────────────────── */

function buildCarCard(car, userId, showFraud) {
  const score   = car.healthScore ?? calculateHealthScore(car.year, car.mileage);
  const band    = getHealthBand(score);
  const wished  = userId ? isInWishlist(userId, car.id) : false;
  const fraud   = showFraud && car.fraudFlag;
  const bg      = makeColor(car.make);

  return `
<div class="car-card" data-id="${car.id}" onclick="navToDetails('${car.id}',event)">
  <div class="car-img-placeholder" style="background:${bg}">${car.make[0]}</div>
  <div class="car-card-body">
    <div class="car-card-header">
      <h3 class="car-card-title">${car.make} ${car.model}</h3>
      ${userId ? `<button class="wishlist-btn${wished?' active':''}" data-car="${car.id}"
        onclick="handleWishlist(event,'${car.id}')" aria-label="Wishlist">♥</button>` : ''}
    </div>
    <p class="car-subtitle">${car.year} &bull; ${car.fuelType} &bull; ${car.transmission}</p>
    <div class="car-price">${formatPrice(car.price)}</div>
    <div class="car-card-footer">
      <span class="health-badge ${band.cls}">&#9679; ${score} ${band.label}</span>
      <span class="view-count">&#128065; ${car.viewCount || 0}</span>
    </div>
    ${fraud ? `<div class="fraud-badge">&#9888; Price Alert</div>` : ''}
  </div>
</div>`;
}

function navToDetails(carId, event) {
  if (event.target.classList.contains('wishlist-btn')) return;
  const user = getCurrentUser();
  if (user) {
    /* increment view count */
    const cars = getCars();
    const car  = cars.find(c => c.id === carId);
    if (car) { car.viewCount = (car.viewCount || 0) + 1; saveCars(cars); }
    addRecentlyViewed(user.id, carId);
  }
  window.location.href = `car-details.html?id=${carId}`;
}

function handleWishlist(event, carId) {
  event.stopPropagation();
  const user = getCurrentUser();
  if (!user) { window.location.href = 'login.html'; return; }
  const added = toggleWishlist(user.id, carId);
  const btn   = event.currentTarget;
  btn.classList.toggle('active', added);
}

/* ─── Wishlist ────────────────────────────────────── */

function getWishlist(userId) {
  return (JSON.parse(localStorage.getItem(WISHLISTS_KEY)) || []).filter(w => w.userId === userId);
}

function isInWishlist(userId, carId) {
  return getWishlist(userId).some(w => w.carId === carId);
}

function toggleWishlist(userId, carId) {
  const all = JSON.parse(localStorage.getItem(WISHLISTS_KEY)) || [];
  const idx = all.findIndex(w => w.userId === userId && w.carId === carId);
  if (idx > -1) {
    all.splice(idx, 1);
    localStorage.setItem(WISHLISTS_KEY, JSON.stringify(all));
    return false;
  }
  all.push({ id: 'WL' + Date.now(), userId, carId, addedDate: new Date().toISOString() });
  localStorage.setItem(WISHLISTS_KEY, JSON.stringify(all));
  return true;
}

/* ─── Recently viewed ─────────────────────────────── */

function addRecentlyViewed(userId, carId) {
  const key = RECENTLY_VIEWED_PFX + userId;
  let rv = JSON.parse(localStorage.getItem(key)) || [];
  rv = rv.filter(r => r.carId !== carId);
  rv.unshift({ carId, viewedDate: new Date().toISOString() });
  if (rv.length > 10) rv = rv.slice(0, 10);
  localStorage.setItem(key, JSON.stringify(rv));
}

function getRecentlyViewed(userId) {
  return JSON.parse(localStorage.getItem(RECENTLY_VIEWED_PFX + userId)) || [];
}

/* ─── Reviews & ratings ───────────────────────────── */

function getSellerReviews(sellerId) {
  return (JSON.parse(localStorage.getItem(REVIEWS_KEY)) || []).filter(r => r.sellerId === sellerId);
}

function getSellerRating(sellerId) {
  const rv = getSellerReviews(sellerId);
  if (!rv.length) return null;
  return { avg: Math.round(rv.reduce((s, r) => s + r.rating, 0) / rv.length * 10) / 10, count: rv.length };
}

function renderStars(rating, outOf = 5) {
  return Array.from({ length: outOf }, (_, i) => i < Math.round(rating) ? '★' : '☆').join('');
}

/* ─── Compare list ────────────────────────────────── */

function getCompareList() {
  return JSON.parse(localStorage.getItem(COMPARE_KEY)) || [];
}

function addToCompare(carId) {
  const list = getCompareList();
  if (list.includes(carId) || list.length >= 3) return false;
  list.push(carId);
  localStorage.setItem(COMPARE_KEY, JSON.stringify(list));
  return true;
}
