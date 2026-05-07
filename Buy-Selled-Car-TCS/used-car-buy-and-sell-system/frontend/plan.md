# Plan: Strengthen Partial Frontend Stories (US004, US005, US006)

## Problem
`frontend/FRONTEND_USER_STORY_AUDIT.md` marks three stories as **Partial**.  
Goal: raise these to acceptance-aligned coverage by closing concrete UI/flow gaps in the frontend layer.

## Current State Snapshot
- **US004 Buyer Homepage** (`frontend/buyer-home.html`): strong nav/search/filter/cards, but page currently focuses on a generic "Available Cars" grid and modal details. It does not implement acceptance-specific **Featured top 4 by health score** and **Recommended for You (last-viewed based)** sections.
- **US005 Seller Dashboard** (`frontend/seller-dashboard.html`): metrics and listing cards are implemented; nav currently has only Dashboard, Add Car, Logout. Required **My Listings, My Reviews, Sales History, Contact Support** flows are missing/incomplete.
- **US006 Car Listing Page** (`frontend/car-listings.html`): filters/sort/wishlist/compare/view count are strong; cards expose a "View Details" link, but acceptance expects listing interaction to clearly support card-click to details/recent-view behavior from listing context.

## Proposed Approach
Use strict story acceptance mapping from `user-stories/frontend_user_stories.csv` and implement targeted enhancements in existing pages first, creating new seller pages only where there is no existing target.

## Detailed Story Plans

### US004 — Buyer Homepage (Featured + Recommendations)
1. **Add Featured Cars section**
   - Add a dedicated section in `buyer-home.html` above/beside existing catalog content.
   - Compute featured list from available cars: sort by `healthScore` desc (fallback `calculateHealthScore(year, mileage)`), tie-break by latest `listingDate`, then take top 4.
   - Render required card fields: placeholder/image, make, model, year, formatted price, color-coded health badge.
   - Make card click navigate to `car-details.html?id=<carId>` (not modal-only interaction).
2. **Add "Recommended for You" section**
   - Read last viewed car from `ucm_recently_viewed_<userId>`.
   - If last viewed exists, recommend 3 available cars matching:
     - same fuel type
     - price within ±20% of last viewed price
     - exclude the last viewed car itself
     - sort by closest price difference then recency.
   - Fallback when no history (or no match): 3 most recently listed available cars.
3. **Refactor homepage rendering flow**
   - Separate data selectors from rendering (`getFeaturedCars`, `getRecommendedCars`, `renderFeatured`, `renderRecommendations`) to keep filtering logic for main grid independent.
   - Ensure sections refresh on load and after catalog mutations.
4. **Acceptance alignment checks**
   - Confirm nav and search behavior remain unchanged while adding acceptance-required sections.

### US005 — Seller Dashboard (Navigation + Reviews/Sales flows)
1. **Upgrade seller nav to acceptance menu**
   - In `seller-dashboard.html`, extend nav links to:
     - Dashboard
     - My Listings
     - Add New Car
     - My Reviews
     - Sales History
     - Contact Support
     - Logout
2. **Implement explicit My Reviews page**
   - Create `seller-reviews.html`:
     - seller-auth guard
     - show all reviews for logged-in seller from `ucm_reviews`
     - display rating summary + review cards (buyer, rating stars, comment, date).
3. **Implement explicit Sales History page**
   - Create `seller-sales-history.html`:
     - seller-auth guard
     - read `ucm_purchases`, filter by `sellerId`
     - show totals (cars sold, revenue) + sale records (car, buyer, amount, date, txn id).
4. **Wire existing pages**
   - Link Contact Support to `support.html`.
   - Keep "My Listings" target as dashboard anchor (`seller-dashboard.html#listings-grid`) to satisfy navigation flow with minimal structural churn.

### US006 — Car Listing Page (Card-click + recent-view behavior)
1. **Make listing cards explicitly navigable**
   - Update `car-listings.html` card markup so clicking card body/title/image routes to details.
   - Preserve button actions (wishlist/compare) without accidental navigation (event handling guard).
2. **Ensure recent-view write occurs from listing interaction path**
   - Add a small shared helper in `frontend/js/cars.js` (or dedicated utility in page script) to push car IDs into `ucm_recently_viewed_<userId>` with de-dup and cap.
   - Call helper before navigation on card click/"View Details" click so recent tracking is guaranteed even before details page loads.
3. **Keep current acceptance-strong pieces stable**
   - Retain existing sidebar filters, sorting, result count, wishlist, compare, view count display.

## Files Expected to Change
- `frontend/buyer-home.html`
- `frontend/car-listings.html`
- `frontend/seller-dashboard.html`
- `frontend/js/cars.js` (shared helper for recent-view consistency)
- `frontend/seller-reviews.html` (new)
- `frontend/seller-sales-history.html` (new)

## Risks / Notes
- There is currently mixed recent-view handling across pages; introducing a shared helper avoids drift and supports both US004 recommendation input and US006 listing-trigger tracking.
- Confirmed scope decision: US005 "My Listings" uses dashboard anchor navigation (`seller-dashboard.html#listings-grid`), not a separate page.

## Todo List (execution order)
1. Implement shared recent-view helper and update listing click tracking.
2. Implement US004 featured/recommendation sections and rendering logic.
3. Implement US005 nav expansion + seller reviews page.
4. Implement seller sales history page and nav wiring.
5. Run acceptance-focused pass for US004/US005/US006 end-to-end flows.
