# Frontend QA & Bug Fix Session — Progress Log

## What Was Done

Full QA pass on the `frontend/` directory. Found and fixed 7 categories of bugs.
All pages should now work end-to-end without errors.

---

## Bugs Fixed

### 1. CSS Folder Named ` css` (Leading Space) — CRITICAL
- **Problem:** The folder was literally named ` css` (with a leading space `0x20`).
  Every HTML page links `css/styles.css`, so the browser couldn't find it.
  The entire app was rendering completely unstyled.
- **Fix:** Renamed ` css` → `css` using `mv`.

---

### 2. Missing `js/app.js` and `js/seed-data.js` — CRITICAL
Three pages referenced these files which never existed:
- `car-listings.html`
- `seller-dashboard.html`
- `add-car.html`

These pages called functions like `requireBuyer()`, `requireSeller()`, `mountNav()`,
`renderBuyerNav()`, `renderSellerNav()`, `seedDataIfEmpty()`, `buildCarCard()`,
`getQueryParam()`, `getSellerRating()`, `renderStars()` — all undefined → instant crash.

**Fix:** Removed the `<script>` tags for the missing files and inlined everything:
- Auth guard using `getCurrentUser()` + role check + redirect
- Nav HTML rendered inline (matching style of working pages like `wishlist.html`)
- `buildCarCard()` written from scratch in `car-listings.html`
- `toggleWishlistCard()` helper in `car-listings.html`
- `getSellerRating()` + `renderStars()` inlined in `seller-dashboard.html`
- `seedDataIfEmpty()` replaced with `seedCarsIfEmpty()` (already in `cars.js`)
- `escapeHtml()` / `escapeAttr()` inlined where needed

---

### 3. `car-details.html` — 5 Broken HTML/JS Spots — CRITICAL

All caused by malformed template literals or copy-paste errors:

| # | Location | Problem | Fix |
|---|----------|---------|-----|
| 1 | `renderFallbackNav()` line ~658 | `<a href="buyer-home.htmlef="buyer-home.html#wishlist/a>` — completely broken anchor | Replaced with correct Home, Wishlist, Recent links |
| 2 | `loadCarDetails()` breadcrumb line ~728 | `<a href="buyer-home.htmlhboard</a>` — href cut off | Fixed to `<a href="buyer-home.html">Dashboard</a>` |
| 3 | Actions sidebar line ~881 | `<button onclick="...buyer-home.html'` — button never closed (no `>` or `</button>`) | Added `">← Back to Home</button>` |
| 4 | `renderAlsoViewed()` line ~928 | `onclick="...'ground:${makeColor(...)};">` — onclick and style attribute fused | Split into proper `onclick` and a nested `<div class="mini-card-img" style="...">` |
| 5 | `notFound()` lines ~951–979 | Template literal never closed; `findSellerForCar()` function definition was embedded inside the HTML string | Closed the template literal properly and separated `findSellerForCar()` as its own function |

---

### 4. No Demo Users / Seed Data — UX BLOCKER

- **Problem:** `seedCarsIfEmpty()` in `cars.js` seeds 6 demo cars, but no users were seeded.
  You had to manually register before you could log in at all.
  The demo seller cars used `sellerId: 'SELLER_DEMO_1'` etc., but no seller user existed
  with that ID, so any seller login would show 0 listings.

- **Fix:** Added `seedUsersIfEmpty()` to `auth.js`:
  - **Buyer demo:** `demoBuyer` / `Demo@1234` (id: `USR_DEMO_BUYER`, city: Mumbai)
  - **Seller demo:** `demoSeller` / `Demo@1234` (id: `SELLER_DEMO_1`, city: Delhi)
    — matches the `sellerId` on seeded cars, so seller dashboard shows all 6 demo listings

- Both `login.html` and `login-seller.html` now:
  - Call `seedUsersIfEmpty()` + `seedCarsIfEmpty()` on load
  - Show a styled demo credentials box (blue for buyer, amber for seller)
  - Load `cars.js` so seed functions are available

---

## Files Modified

| File | What Changed |
|------|-------------|
| `frontend/ css/` → `frontend/css/` | Renamed (removed leading space) |
| `frontend/js/auth.js` | Added `seedUsersIfEmpty()` with 2 demo accounts |
| `frontend/login.html` | Added `cars.js` import, calls seeds, demo credentials UI |
| `frontend/login-seller.html` | Added `cars.js` import, calls seeds, demo credentials UI |
| `frontend/car-details.html` | Fixed 5 broken HTML/JS template literal spots |
| `frontend/car-listings.html` | Removed missing script deps, inlined auth + nav + `buildCarCard()` + helpers |
| `frontend/seller-dashboard.html` | Removed missing script deps, inlined auth + nav + `getSellerRating()` + `renderStars()` |
| `frontend/add-car.html` | Removed missing script deps, inlined auth + nav |

---

## Files NOT Modified (Working Correctly)

- `frontend/index.html` — redirect to login.html ✓
- `frontend/register.html` — full validation, duplicate checks ✓
- `frontend/buyer-home.html` — dashboard, filters, car modal, stats ✓
- `frontend/wishlist.html` — wishlist with remove + timestamps ✓
- `frontend/recently-viewed.html` — recently viewed with timestamps ✓
- `frontend/js/cars.js` — all car helpers, health score, fraud detection ✓

---

## How to Test

1. Open `frontend/index.html` in browser (or `frontend/login.html`)
2. Use demo credentials shown on the page — no registration needed
3. **Buyer flow:** Login → buyer-home dashboard → filter/search cars → View Details → wishlist → recently viewed
4. **Seller flow:** Go to `login-seller.html` → login → seller dashboard (sees 6 demo cars) → Add Car

---

## Changelog

### 2026-05-04 — Purchase Flow + Seller Listing Management

- Added `frontend/purchase.html` (new page).
  - Buyer auth guard (`buyer` role only).
  - Query-param based car lookup (`?id=<carId>`).
  - Not-found and already-sold handling states.
  - Confirm purchase action now:
    - marks car as sold,
    - records purchase in localStorage (`ucm_purchases`),
    - removes buyer interest flag for that car,
    - renders purchase receipt summary.

- Enhanced `frontend/seller-dashboard.html` with listing management actions.
  - Edit listing price (`Edit Price`).
  - Delete listing with confirmation (`Delete`).
  - Toggle listing status (`Mark Sold` / `Mark Available`).
  - Dashboard now renders all seller listings and shows status badge per listing.

- Validation completed after changes.
  - Verified all major frontend routes return HTTP 200, including `purchase.html`.
  - Verified local asset/link references resolve correctly across frontend HTML files.

## Known Remaining Gaps (Not Bugs, Just Missing Features)

- `car-listings.html` linked from nav but it's a separate, more detailed browse page with sidebar filters — it works now but is somewhat redundant with `buyer-home.html`.
- No actual backend — everything is localStorage only.
