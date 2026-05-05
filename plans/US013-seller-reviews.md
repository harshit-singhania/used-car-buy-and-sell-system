# US013 — Seller Reviews and Ratings

## Story
**As a Buyer**, I want to rate and review a seller after purchasing a car so that other buyers can make informed decisions.

---

## Files
- `frontend/purchase.html` — review submission (two entry points)
- `frontend/car-details.html` — review display (read-only)
- `frontend/my-purchases.html` — Rate Seller link to review form

---

## Acceptance Criteria Checklist

| # | Criterion | Status |
|---|-----------|--------|
| 1 | 'Rate this Seller' prompt on Purchase Success screen | ✅ Done — shown in `renderReceipt()` |
| 2 | Star Rating: clickable 1–5 stars (required) | ✅ Done — `.star-btn` with `setStarRating()` |
| 3 | Review Comment: textarea, max 200 chars, optional | ✅ Done |
| 4 | Submit Review button | ✅ Done — `submitSellerReview()` |
| 5 | Store review in `ucm_reviews` array | ✅ Done — `saveReviews()` |
| 6 | Review object fields: reviewId, purchaseId, sellerId, buyerId, buyerName, rating, comment, reviewDate | ✅ Done |
| 7 | Confirmation: 'Thank you for your review!' | ✅ Done — form hidden, success div shown |
| 8 | Seller avg rating recalculated across all reviews | ✅ Done — `getSellerRatingSummary()` reads live from `ucm_reviews` |
| 9 | Display avg rating as stars with numeric value on Car Details | ✅ Done — car-details.html seller info section |
| 10 | Display '(X reviews)' count | ✅ Done |
| 11 | List individual reviews: buyer first name, stars, comment, date | ✅ Done — car-details.html reviews section, newest first |
| 12 | One review per purchase (deduplication) | ✅ Done — checked on `purchaseId + buyerId` |
| 13 | Already reviewed message: 'You have already reviewed this seller for this purchase.' | ✅ Done — shown in `renderReviewOnly()` |

---

## Implementation Details

### Two Entry Points into the Review Form

#### 1. Post-Purchase Receipt (immediate)
After `confirmPurchase()` succeeds, `renderReceipt()` renders the purchase summary **plus** an inline review form at the bottom. The buyer can rate the seller immediately without leaving the page.

#### 2. My Purchases → Rate Seller (deferred)
`my-purchases.html` shows a "Rate Seller" button for each unreviewed purchase:
```
<a href="purchase.html?reviewPurchase=<purchaseId>">Rate Seller</a>
```
`purchase.html` detects the `reviewPurchase` query param in `loadPurchasePage()` and calls `loadReviewMode(purchaseId)` → `renderReviewOnly(purchase, car)`.

### Review Submission Flow (`submitSellerReview`)
1. Validate `selectedRating` is 1–5 (required).
2. Check `ucm_reviews` for existing `{ purchaseId, buyerId }` pair — reject if duplicate.
3. Push new review object to array.
4. Save via `saveReviews()` (from `cars.js`) or fall back to direct `localStorage.setItem`.
5. Hide `#review-form`, show `#review-success`.

### Review Display on Car Details Page
`car-details.html` — Seller Information section:
- Reads `getReviewsForSeller(sellerId)` from `cars.js`
- Shows `★★★★☆ 4.2 (12 reviews)` using `renderStars(avg)` + numeric average + count
- Lists up to 3 most recent reviews sorted by `reviewDate` descending
- Each review shows: buyer first name, star rating, comment, formatted date

### LocalStorage Schema
| Key | Type | Purpose |
|-----|------|---------|
| `ucm_reviews` | `Review[]` | All seller reviews, global |
| `ucm_purchases` | `Purchase[]` | Read to verify purchase ownership |

### Review Object Schema
```json
{
  "reviewId": "REV<timestamp>",
  "purchaseId": "<purchaseId>",
  "sellerId": "<sellerId>",
  "buyerId": "<buyerId>",
  "buyerName": "FirstName",
  "rating": 4,
  "comment": "Great seller, smooth transaction.",
  "reviewDate": "<ISO date>"
}
```

### Key Functions Used
| Function | Source | Purpose |
|----------|--------|---------|
| `getReviews()` | `cars.js` | Load all reviews |
| `saveReviews(reviews)` | `cars.js` | Persist review array |
| `getReviewsForSeller(sellerId)` | `cars.js` | Filter reviews by seller |
| `getSellerRatingSummary(sellerId)` | `cars.js` | `{ avg, count }` for display |
| `setStarRating(value)` | inline | Toggle `.active` class on star buttons |

---

## Verification Steps
1. Complete a car purchase (see US012 verification).
2. On the receipt page, click stars 1–5 — verify they highlight amber.
3. Submit review without selecting a star → error message appears.
4. Select a rating, optionally add a comment, click "Submit Review".
5. Verify "Thank you for your review!" confirmation appears.
6. Navigate to `my-purchases.html` → confirm the "Reviewed" disabled button now shows for that purchase.
7. Navigate to `car-details.html?id=<same-car>` → verify the seller info section shows updated average rating and the new review in the list.
8. Try submitting a second review for the same purchase (via `purchase.html?reviewPurchase=<id>`) → "You have already reviewed this seller for this purchase." message appears.
