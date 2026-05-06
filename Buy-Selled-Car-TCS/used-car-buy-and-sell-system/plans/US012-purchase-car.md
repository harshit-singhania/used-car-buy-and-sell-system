# US012 — Purchase Car

## Story
**As a Buyer**, I want to purchase a car through a confirmation flow so that I can complete my transaction.

---

## File
`frontend/purchase.html`

---

## Acceptance Criteria Checklist

| # | Criterion | Status |
|---|-----------|--------|
| 1 | Order Summary: Car Make, Model, Year, Color | ✅ Done |
| 2 | Order Summary: Price prominently displayed | ✅ Done — `.price` class, accent color |
| 3 | Order Summary: Seller Name and Rating | ✅ Done — chip with stars + avg + count |
| 4 | Order Summary: Health Score badge | ⚠️ Gap — shows plain number, not color-coded badge |
| 5 | Buyer Confirmation: pre-filled name, email, phone (read-only) | ✅ Done |
| 6 | Buyer Confirmation: mandatory checkbox | ✅ Done — disables Confirm button until checked |
| 7 | Payment Method: Cash, Bank Transfer, EMI radio buttons | ✅ Done |
| 8 | EMI Calculator: shows 12, 24, 36 months @ 9% interest | ✅ Done — `calculateEmi()` |
| 9 | Confirm Purchase: disabled until checkbox checked | ✅ Done — `toggleConfirmButton()` |
| 10 | On confirm: update car status to 'sold' | ✅ Done — `markCarSold(carId)` |
| 11 | On confirm: create purchase record in `ucm_purchases` | ✅ Done — `PUR` + timestamp ID |
| 12 | On confirm: remove car from buyer's wishlist | ✅ Done — `removeFromWishlist(carId)` |
| 13 | Success screen: 'Purchase Successful! Transaction ID: <id>' | ✅ Done — `renderReceipt()` |
| 14 | Cancel button: navigates back to Car Details | ✅ Done |
| 15 | Already-sold guard: disable Confirm, show error message | ✅ Done — re-checks status on confirm click |

---

## Gap & Fix

### Gap: Health Score badge not color-coded (Criterion 4)

**Location**: `purchase.html` — inside `renderCheckout()`, line ~297

**Current code:**
```javascript
<div class="chip"><b>Health Score</b>${escapeHtml(score)}</div>
```

**Fixed code:**
```javascript
<div class="chip"><b>Health Score</b>
  <span class="health-badge ${getHealthBand(score).cls}">${escapeHtml(String(score))} ${escapeHtml(getHealthBand(score).label)}</span>
</div>
```

`getHealthBand(score)` is available from `js/cars.js` and returns:
- Score 70–100 → `{ cls: 'health-good', label: 'Excellent' }`
- Score 40–69 → `{ cls: 'health-average', label: 'Good' }`
- Score 0–39  → `{ cls: 'health-poor', label: 'Needs Attention' }`

---

## Implementation Details

### Page Modes
The page has three rendering modes selected by URL parameters:

| Mode | URL | Entry Function | Description |
|------|-----|----------------|-------------|
| Checkout | `purchase.html?id=<carId>` | `renderCheckout(car)` | Full purchase flow |
| Review-only | `purchase.html?reviewPurchase=<purchaseId>` | `renderReviewOnly(purchase, car)` | Rate seller post-purchase |
| Already sold | (same as checkout) | `renderSoldState(car)` | Error state |

### LocalStorage Keys
| Key | Type | Purpose |
|-----|------|---------|
| `ucm_purchases` | `Purchase[]` | Append new purchase record on confirm |
| `ucm_cars` | `Car[]` | Read car details; updated to 'sold' on confirm |
| `ucm_wishlist_[userId]` | `string[]` | Remove car on confirm |
| `ucm_interested_[userId]` | `string[]` | Clear interest flag on confirm |
| `ucm_users` | `User[]` | Look up seller name/details |
| `ucm_reviews` | `Review[]` | Used by `getSellerRatingSummary()` |

### Purchase Record Schema
```json
{
  "id": "PUR<timestamp>",
  "carId": "<carId>",
  "buyerId": "<userId>",
  "sellerId": "<sellerId>",
  "purchaseDate": "<ISO date>",
  "amount": 560000,
  "paymentMethod": "Cash | Bank Transfer | EMI",
  "sellerNameAtPurchase": "Seller Full Name",
  "sellerRatingAtPurchase": 4.2
}
```

### EMI Formula
```
EMI = P × r × (1 + r)^n / ((1 + r)^n − 1)
where r = 0.09 / 12  (9% annual → monthly)
      n = number of months (12, 24, or 36)
      P = car price
```

### Key Functions Used
| Function | Source | Purpose |
|----------|--------|---------|
| `getCurrentUser()` | `auth.js` | Auth guard |
| `getCarById(id)` | `cars.js` | Load car |
| `markCarSold(id)` | `cars.js` | Set status='sold' |
| `calculateHealthScore(year, mileage)` | `cars.js` | Fallback health score |
| `getHealthBand(score)` | `cars.js` | Color-coded badge class |
| `getSellerRatingSummary(sellerId)` | `cars.js` | Seller avg rating |
| `formatPrice(value)` | `cars.js` | INR formatted price |
| `formatKilometers(value)` | `cars.js` | Mileage with km |
| `makeColor(make)` | `cars.js` | Car hero gradient |
| `saveReviews(reviews)` | `cars.js` | Persist review array |

---

## Verification Steps
1. From `car-listings.html`, click a car → click "Buy This Car" on `car-details.html`.
2. Verify checkout page shows Make/Model/Year/Color, price, seller info.
3. Verify Health Score chip shows a color-coded badge (green/yellow/red), not just a number.
4. Select EMI payment → verify three EMI boxes appear with correct monthly amounts.
5. Try clicking "Confirm Purchase" without ticking checkbox → button should be disabled.
6. Tick checkbox → button enables → click Confirm.
7. Verify receipt page shows Transaction ID.
8. Navigate back to `car-listings.html` → confirm the purchased car no longer appears.
9. Navigate to `my-purchases.html` → confirm the purchase record appears.
10. Try opening `purchase.html?id=<same-car-id>` again → verify "already sold" error state.
