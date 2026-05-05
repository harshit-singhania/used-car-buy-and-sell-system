# US014 — Purchase History

## Story
**As a Buyer**, I want to view my purchase history so that I can track all cars I have bought.

---

## File
`frontend/my-purchases.html`

---

## Acceptance Criteria Checklist

| # | Criterion | Status |
|---|-----------|--------|
| 1 | Retrieve all purchases for current buyer from `ucm_purchases` | ✅ Done |
| 2 | Page heading: 'My Purchases (X total)' | ✅ Done — dynamic via `textContent` |
| 3 | Each purchase card: Transaction ID | ✅ Done |
| 4 | Each purchase card: Car Make, Model, Year | ✅ Done |
| 5 | Each purchase card: Purchase Date formatted as DD-MMM-YYYY | ⚠️ Gap — outputs `05 May 2026`, not `05-May-2026` |
| 6 | Each purchase card: Amount Paid with ₹ and commas | ✅ Done — `formatPrice()` |
| 7 | Each purchase card: Seller Name and Rating at time of purchase | ✅ Done — stored at purchase time |
| 8 | 'View Car Details' button per card | ✅ Done |
| 9 | 'Rate Seller' button (only if not already reviewed) | ✅ Done — `reviewed` boolean check |
| 10 | 'Reviewed' disabled button when already reviewed | ✅ Done |
| 11 | Summary: Total Amount Spent | ✅ Done |
| 12 | Summary: Total Cars Bought | ✅ Done |
| 13 | Summary: Most Recent Purchase date | ✅ Done |
| 14 | Empty state with 'Browse Cars' link | ✅ Done |
| 15 | Purchases sorted newest first | ✅ Done — `sort()` by `purchaseDate` desc |
| 16 | Auth guard (buyer-only, redirect to login) | ✅ Done |

---

## Gap & Fix

### Gap: Date format should be DD-MMM-YYYY with hyphens (Criterion 5)

**Location**: `my-purchases.html` — `formatDate()` function, line ~279

**Current code:**
```javascript
function formatDate(value) {
  const date = new Date(value || Date.now());
  if (isNaN(date.getTime())) return '—';
  return date.toLocaleDateString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric'
  });
}
```
Outputs: `05 May 2026` (space-separated, locale-dependent)

**Fixed code:**
```javascript
function formatDate(value) {
  const date = new Date(value || Date.now());
  if (isNaN(date.getTime())) return '—';
  const day = String(date.getDate()).padStart(2, '0');
  const months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
  const month = months[date.getMonth()];
  const year = date.getFullYear();
  return `${day}-${month}-${year}`;
}
```
Outputs: `05-May-2026`

---

## Implementation Details

### Page Load Flow
1. `DOMContentLoaded` → `getCurrentUser()` → redirect if null or not buyer
2. `renderNav()` — injects sticky nav with "My Purchases" active
3. `renderPurchases()`:
   - Reads `ucm_purchases` via `getPurchases()`
   - Filters by `buyerId === currentUser.id`
   - Sorts by `purchaseDate` descending
   - Updates `#page-title` text
   - Calls `renderSummary(purchases)` → fills `#summary` section
   - Renders purchase cards or empty state into `#content`

### LocalStorage Keys
| Key | Type | Purpose |
|-----|------|---------|
| `ucm_purchases` | `Purchase[]` | All purchase records (filtered by buyerId) |
| `ucm_cars` | `Car[]` | Look up car details by `carId` |
| `ucm_reviews` | `Review[]` | Check if buyer already reviewed each purchase |
| `ucm_users` | `User[]` | Fallback seller name via `getSellerName()` |

### Purchase Card Layout
```
┌──────────────────────────────────────────┐
│ Hyundai Creta (2021)    [Transaction ID] │  ← .card-top flex
│ Transaction ID: PUR1234567890            │
│                               ₹7,50,000  │  ← .amount
├──────────────────────────────────────────┤
│ Purchase Date │ Seller           │        │  ← .meta grid (2-col)
│ 05-May-2026   │ Rahul Sharma     │        │
│ Seller Rating │ Status           │
│ ★★★★☆ 4.0/5  │ SOLD             │
├──────────────────────────────────────────┤
│ [View Car Details]  [Rate Seller / Reviewed] │
└──────────────────────────────────────────┘
```

### Summary Section
Three stat cards in a 3-column grid:
| Stat | Value |
|------|-------|
| Total Amount Spent | Sum of all `purchase.amount` values via `formatPrice()` |
| Total Cars Bought | `purchases.length` |
| Most Recent Purchase | `formatDate(purchases[0].purchaseDate)` after sort |

### Key Functions Used
| Function | Source | Purpose |
|----------|--------|---------|
| `getCurrentUser()` | `auth.js` | Auth check |
| `getUsers()` | `auth.js` | Look up seller by ID |
| `getCars()` / `getCarById(id)` | `cars.js` | Car details |
| `getSellerRatingSummary(sellerId)` | `cars.js` | Seller rating |
| `getReviews()` | `cars.js` | Check reviewed status |
| `formatPrice(value)` | `cars.js` | Currency formatting |

---

## Verification Steps
1. Complete 1–2 purchases (see US012).
2. Navigate to `my-purchases.html`.
3. Verify page title reads `My Purchases (N total)`.
4. Verify summary stats show correct totals.
5. Verify each card shows the purchase date in `DD-MMM-YYYY` format (e.g., `05-May-2026`).
6. Click "View Car Details" → confirms navigation to `car-details.html?id=<carId>`.
7. Click "Rate Seller" → navigates to `purchase.html?reviewPurchase=<id>`.
8. After rating, return to My Purchases → button now shows "Reviewed" (disabled).
9. With no purchases: verify empty state and "Browse Cars" link are shown.
