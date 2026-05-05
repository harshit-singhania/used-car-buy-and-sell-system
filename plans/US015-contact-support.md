# US015 — Contact Support and Help

## Story
**As a User**, I want to access a support page so that I can get help with using the platform.

---

## File
`frontend/support.html`

---

## Acceptance Criteria Checklist

| # | Criterion | Status |
|---|-----------|--------|
| 1 | Contact Details: Phone (toll-free) | ✅ Done — +91-1800-123-4567 |
| 2 | Contact Details: Email | ✅ Done — support@usedcarmart.com |
| 3 | Contact Details: Working Hours | ✅ Done — Mon-Sat, 9 AM - 6 PM IST |
| 4 | Contact Details: Office Address | ✅ Done — Noida, Uttar Pradesh |
| 5 | FAQ: at least 5 expandable accordion items | ✅ Done — native `<details>/<summary>` |
| 6 | FAQ: 'How do I list my car for sale?' | ✅ Done |
| 7 | FAQ: 'How is the Car Health Score calculated?' | ✅ Done — formula shown |
| 8 | FAQ: 'What does the Price Alert warning mean?' | ✅ Done |
| 9 | FAQ: 'How do I contact a seller?' | ✅ Done |
| 10 | FAQ: 'Can I cancel a purchase?' | ✅ Done |
| 11 | Feedback Form: Name pre-filled from logged-in user (read-only) | ✅ Done |
| 12 | Feedback Form: Subject dropdown (5 options) | ✅ Done |
| 13 | Feedback Form: Message textarea (min 20, max 500 chars) | ✅ Done — validated before submit |
| 14 | Feedback Form: Submit saves to `ucm_feedbacks` | ✅ Done |
| 15 | Success message: 'Thank you for your feedback! We will get back to you shortly.' | ✅ Done |
| 16 | 'Back to Home' button at the bottom of the page | ⚠️ Gap — button exists at top only |
| 17 | Role-aware navigation (buyer links vs seller links) | ✅ Done |
| 18 | Auth guard (redirect to login if not logged in) | ✅ Done |

---

## Gap & Fix

### Gap: 'Back to Home' button should also appear at the bottom of the page (Criterion 16)

**Location**: `support.html` — after the closing `</section>` of the feedback form, around line 150

**Current state**: A "Back to Home" button exists in the "Need Quick Help?" card near the top of the page, but there is no bottom-of-page navigation button.

**Fix**: Add a bottom navigation section after the feedback form section:
```html
<div style="margin-top:1.25rem;text-align:center;">
  <a class="btn btn-secondary" id="back-home-btn-bottom" href="buyer-home.html">Back to Home</a>
</div>
```

Then in `setDefaults()`, also update this button's `href`:
```javascript
function setDefaults() {
  document.getElementById('feedback-name').value = currentUser.fullName || currentUser.userId || 'User';
  const role = String(currentUser.role || '').trim().toLowerCase();
  const homeUrl = role === 'seller' ? 'seller-dashboard.html' : 'buyer-home.html';
  document.getElementById('back-home-btn').href = homeUrl;
  document.getElementById('back-home-btn-bottom').href = homeUrl;
}
```

---

## Implementation Details

### Page Structure
```
[Sticky Nav]
├── Row 1 (2-col grid)
│   ├── Contact Support card (phone, email, hours, address)
│   └── Need Quick Help? card (description + Back to Home button ← TOP)
├── FAQ card (5 <details> items)
├── Send Feedback card (form)
└── Back to Home button ← BOTTOM (gap fix)
```

### FAQ Accordion Pattern
Uses native HTML `<details>` and `<summary>` — no JavaScript required:
```html
<details>
  <summary>Question text</summary>
  <p>Answer text</p>
</details>
```
CSS handles visual styling (`border`, `border-radius`, `background: #f8fafc`).

### Feedback Form Validation
- Name: read-only, pre-filled from `currentUser.fullName || currentUser.userId`
- Subject: dropdown, no validation (has default selection)
- Message: validated in `saveFeedback()` — must be ≥ 20 characters; error shown in `#feedback-message-error`
- On success: saves to `ucm_feedbacks`, shows success alert, resets form fields (preserving success message visibility)

### LocalStorage Keys
| Key | Type | Purpose |
|-----|------|---------|
| `ucm_feedbacks` | `Feedback[]` | Append new feedback on form submit |
| `ucm_currentUser` | `User` | Read user name and role via `getCurrentUser()` |

### Feedback Object Schema
```json
{
  "id": "FB<timestamp>",
  "userId": "<userId>",
  "name": "Full Name",
  "subject": "General Inquiry",
  "message": "Message text here...",
  "createdAt": "<ISO date>"
}
```

### Role-Aware Navigation
The `renderNav()` function checks `currentUser.role`:
- **buyer** → shows Home, Browse, Wishlist, Recent, My Purchases, Compare Cars, Support (active), Logout
- **seller** → shows Dashboard, Add Car, Support (active), Logout

The "Back to Home" button (both top and bottom) is set dynamically in `setDefaults()`:
- buyer → `buyer-home.html`
- seller → `seller-dashboard.html`

### Key Functions Used
| Function | Source | Purpose |
|----------|--------|---------|
| `getCurrentUser()` | `auth.js` | Auth guard + pre-fill name |
| `clearCurrentUser()` | `auth.js` | Logout handler |

---

## Verification Steps
1. Login as a buyer → navigate to `support.html`.
2. Verify contact details are visible (phone, email, hours, address).
3. Click each FAQ item — verify it expands with the answer and collapses on re-click.
4. Scroll to the feedback form — verify Name is pre-filled and read-only.
5. Try submitting with a message < 20 characters → error message appears.
6. Enter a valid message (≥ 20 chars) and submit → success banner appears, form clears.
7. Open browser DevTools → Application → LocalStorage → verify `ucm_feedbacks` has a new entry.
8. Verify "Back to Home" button at the **bottom** of the page navigates to `buyer-home.html`.
9. Logout → login as a seller → navigate to `support.html`:
   - Nav shows Dashboard, Add Car, Support links
   - "Back to Home" buttons navigate to `seller-dashboard.html`
