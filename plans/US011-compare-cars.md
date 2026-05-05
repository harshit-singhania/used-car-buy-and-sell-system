# US011 — Car Comparison Page

## Story
**As a Buyer**, I want to compare multiple cars side by side so that I can evaluate which car is the best deal.

---

## File
`frontend/compare-cars.html`

---

## Acceptance Criteria Checklist

| # | Criterion | Status |
|---|-----------|--------|
| 1 | Display selected cars as columns (min 2, max 3) | ✅ Done |
| 2 | Row: Car image placeholder | ✅ Done — brand-initial thumbnail with `makeColor()` gradient |
| 3 | Row: Make and Model | ✅ Done |
| 4 | Row: Year | ✅ Done |
| 5 | Row: Price (formatted) | ✅ Done — `formatPrice()` |
| 6 | Row: Fuel Type | ✅ Done |
| 7 | Row: Transmission | ✅ Done |
| 8 | Row: Mileage | ✅ Done — `formatKilometers()` |
| 9 | Row: Health Score with color-coded badge | ✅ Done — `getHealthBand()` class applied |
| 10 | Row: Seller Rating (stars) | ✅ Done — `renderStars()` with avg and count |
| 11 | Row: Fraud Flag status | ✅ Done — `isFraudFlagged()` |
| 12 | Row: Price vs Market Average (percentage) | ✅ Done — `getAveragePrice()` with % diff |
| 13 | Best value in each row highlighted green | ✅ Done — `.best` badge on lowest price, lowest mileage, highest health, highest rating |
| 14 | Remove button per car column | ✅ Done — `removeFromCompare(carId)` |
| 15 | Add More Cars button (disabled at 3 cars) | ✅ Done — `pointer-events:none; opacity:0.5` at max |
| 16 | Clear All button | ✅ Done — `clearCompareList()` |
| 17 | Empty state when < 2 cars with Browse Cars link | ✅ Done |
| 18 | Auth guard (buyer-only, redirect to login) | ✅ Done |

---

## Implementation Details

### LocalStorage
| Key | Type | Purpose |
|-----|------|---------|
| `ucm_compare_[userId]` | `string[]` | Array of car IDs to compare (max 3) |
| `ucm_cars` | `Car[]` | All car listings (read via `getCars()`) |
| `ucm_reviews` | `Review[]` | Used to compute seller ratings |

### Key Functions Used (from `js/cars.js`)
| Function | Purpose |
|----------|---------|
| `getCars()` | Load all cars from LocalStorage |
| `getCarById(id)` | Look up a car by ID |
| `calculateHealthScore(year, mileage)` | Fallback if `healthScore` not stored |
| `getHealthBand(score)` | Returns `{ label, cls }` for color coding |
| `getAveragePrice(make, year, cars)` | Market average for fraud/comparison |
| `isFraudFlagged(price, make, year, cars)` | 40% deviation check |
| `formatPrice(value)` | INR formatted price string |
| `formatKilometers(value)` | Mileage with "km" unit |
| `makeColor(make)` | Brand gradient for thumbnail |
| `getSellerRatingSummary(sellerId)` | `{ avg, count }` from `ucm_reviews` |

### Page Logic Flow
1. `DOMContentLoaded` → `getCurrentUser()` → redirect if null or not buyer
2. `seedCarsIfEmpty()` → ensures demo data exists
3. `renderNav()` → injects sticky top nav with "Compare Cars" active
4. `renderCompare()`:
   - Reads `ucm_compare_[userId]` → resolves car objects via `getCars()`
   - If < 2 cars: renders empty state
   - Computes min/max values for best-highlighting
   - Renders `<table class="compare-table">` with `rowCells(label, cellsArray)` helper
5. `removeFromCompare(carId)` → filters LocalStorage array, re-renders
6. `clearCompareList()` → sets array to `[]`, re-renders

### Comparison Table Structure
```
<table class="compare-table">
  <tbody>
    <tr><th class="attr">Car</th>     <td>…</td> <td>…</td> <td>…</td></tr>
    <tr><th class="attr">Year</th>    <td>…</td> …</tr>
    <tr><th class="attr">Price</th>   <td>…</td> …</tr>
    … 7 more rows …
  </tbody>
</table>
```
Sticky left column (`.attr`) on desktop; falls back to static on < 920 px.

### Best-Value Highlighting Rule
| Row | Best = |
|-----|--------|
| Price | Lowest value |
| Mileage | Lowest value |
| Health Score | Highest value |
| Seller Rating | Highest value |

All others (Year, Fuel Type, Transmission, Fraud Flag, Price vs Avg) are informational — no highlighting.

---

## Verification Steps
1. Open `car-listings.html` → click a car → on car details page click "Compare".
2. Repeat for a second car (and optionally a third).
3. Navigate to `compare-cars.html`.
4. Verify all 10 attribute rows render.
5. Confirm best-value cells show the green `.best` badge.
6. Click "Remove" on one column — table re-renders with remaining cars.
7. Drop below 2 cars — empty state appears with "Browse Cars" link.
8. Click "Clear All" — empty state appears immediately.
9. With 3 cars: verify "Add More Cars" button is visually disabled and unclickable.
