# Copilot Instructions for Used Car Buy and Sell System

## Project Summary
**TCS ILP Sprint 1 project** — a Used Car Marketplace system built across **four independent layers** (not yet integrated):
- **Frontend**: Vanilla JS + HTML5/CSS3 with LocalStorage
- **Java Backend**: Core Java console app with in-memory storage (ArrayList)
- **UNIX Layer**: Shell scripts using flat files (awk, grep, sort, wc, sed)
- **SQL Layer**: Schema and queries only (MySQL syntax)

Each layer is independently runnable and must implement the same 8 core features consistently.

---

## Running Each Layer

### Frontend
```bash
# Open frontend/index.html in a browser
# Entry point: login.html (index.html redirects there)
```
- **Entry pages**: `login.html` (buyer) and `login-seller.html` (seller)
- Data persists in browser's localStorage under keys like `ucm_users`, `ucm_cars`
- No build step required; edit HTML/JS/CSS and refresh

### Java Backend
```bash
cd java-backend
javac *.java
java Main
```
- Menu-driven console app
- Must implement full CRUD for all entities

### UNIX Shell Scripts
```bash
cd unix
bash <script-name>.sh
```
- Uses flat files: `cars.txt`, `users.txt`, `purchases.txt`, `wishlists.txt`, `reviews.txt`
- Pipe-delimited format (see Flat File Formats section below)

### SQL
```bash
# Run in any MySQL-compatible client (mysql, MariaDB, SQLite)
mysql -u user -p database < sql/schema.sql
```
- Schema definitions and JOIN queries only (not connected to running app)

---

## Architecture & Core Concepts

### Design Philosophy: "SMART but SIMPLE"
Features appear innovative but use simple logic:
- Conditional filters (if/else, array methods)
- Basic arithmetic (averages, percentages)
- Derived fields (calculated on-the-fly)
- Rule-based thresholds (e.g., health score, fraud detection)

### 8 Required Features (Must Appear in ALL Layers)

1. **Car Recommendation System** — Filter by user's price range, fuel type, or brand
2. **Wishlist / Saved Cars** — Users save and retrieve favorite cars
3. **Recently Viewed Cars** — Track last N viewed cars per user
4. **Car Health Score** — Derived: `100 - (currentYear - carYear)*3 - (mileage/10000)*2` (clamped 0–100)
5. **Fraud Detection Flag** — Flag if price deviates >40% from average for same make+year
6. **Seller Rating System** — Average rating from buyer reviews
7. **Smart Search & Filtering** — Multi-criteria: price range, brand, fuel type, year, transmission
8. **Purchase History & Analytics** — Show total spent, cars bought, seller stats

### Core Entities (Consistent Across All Layers)
- **Users**: id, name, email, phone, role (buyer/seller), registrationDate
- **Cars**: id, make, model, year, price, mileage, fuelType, transmission, color, sellerId, status (available/sold), healthScore, fraudFlag, listingDate
- **Purchases**: id, carId, buyerId, sellerId, purchaseDate, amount
- **Wishlists**: id, userId, carId, addedDate
- **Reviews**: id, sellerId, buyerId, rating, comment, reviewDate
- **RecentlyViewed**: userId, carId, viewedDate

---

## Naming Conventions

| Layer | Pattern | Examples |
|-------|---------|----------|
| **Frontend** | kebab-case files; camelCase JS vars | `add-car.html`, `userId`, `getCars()` |
| **Java** | PascalCase classes; camelCase methods | `class User`, `getUserById()`, packages `com.usedcar.*` |
| **UNIX** | snake_case scripts; .sh extension | `get_car_by_id.sh` |
| **SQL** | UPPERCASE keywords; snake_case tables/columns | `SELECT * FROM user_reviews WHERE user_id = 1` |

### Frontend LocalStorage Keys
- `ucm_users` — Array of user objects
- `ucm_currentUser` — Current logged-in user
- `ucm_cars` — Array of car listings
- Follow prefix: `ucm_` (used car marketplace)

---

## Flat File Formats (UNIX Layer)

All files are **pipe-delimited** and stored in the `unix/` directory:

```
# cars.txt
id|make|model|year|price|mileage|fuelType|transmission|color|sellerId|status|listingDate

# users.txt
id|name|email|phone|role|registrationDate

# purchases.txt
id|carId|buyerId|sellerId|purchaseDate|amount

# wishlists.txt
id|userId|carId|addedDate

# reviews.txt
id|sellerId|buyerId|rating|comment|reviewDate
```

---

## Key Frontend Patterns

### LocalStorage Helpers (from `frontend/js/auth.js` & `frontend/js/cars.js`)
```javascript
// Usage pattern:
const users = getUsers();           // Read from localStorage
users.push(newUser);
saveUsers(users);                   // Write back

// Field-level error handling:
showFieldError('userId', 'User ID already exists');
clearFieldError('userId');

// Banner alerts:
showAlert('login-error', 'Invalid credentials');
```

### Form Validation
- Inline error messages with `.error-msg` elements
- Field IDs follow pattern: `<fieldName>` with error at `<fieldName>-error`
- Add `is-error` class to input on validation failure
- Use `novalidate` on form to handle validation with JS

### User Roles
- **Buyer**: Browse, filter, recommend, purchase, review
- **Seller**: List cars, view dashboard, manage listings

---

## Coding Standards

### General
- **No frameworks**: Frontend is vanilla JS/HTML/CSS only
- **No libraries**: Everything built from scratch
- **Comments**: Only for non-obvious logic; omit obvious code
- **Output**: Clean, semantic HTML; avoid inline styles
- **Independence**: All layers runnable without others

### Frontend-Specific
- Use semantic HTML5 elements (`<form>`, `<fieldset>`, `<input>`)
- CSS uses utility classes for consistency
- JS uses ES5 (function declarations, not arrow functions) for broad compatibility
- Avoid DOM queries in loops; cache references

### Java-Specific
- ArrayList for in-memory storage
- No Spring Boot, no external databases
- Menu-driven console interface
- Package structure: `com.usedcar.entity`, `com.usedcar.service`, etc.

### UNIX-Specific
- Use core commands: `awk`, `grep`, `sort`, `wc`, `sed`
- No Python, Perl, or other interpreted languages
- Pipe-delimited data format
- Error handling with exit codes

---

## User Story Format

Each layer has a CSV in `user-stories/` with format:

```
SlNo,Feature,Story Number,Description (Card),Acceptance Criteria
```

**Requirements**:
- Story numbers: US001, US002, ... (sequential per layer)
- Description: "As a <user>, I want <goal> so that <reason>"
- Acceptance criteria: Detailed, semicolon-separated, implementable
- Minimum 8–10 stories per layer
- **Same features must appear across all four layer CSVs** (consistency check)

**Output rule**: When generating or updating user stories, output CSV only—no markdown, no explanation.

---

## Output Rules & Deliverables

1. **User Stories**: CSV format only; no markdown wrapper
2. **Code**: Clean, minimal comments, all layers independently testable
3. **Flat Files (UNIX)**: Pipe-delimited, consistent with format above
4. **All layers must be independently runnable** without external dependencies

---

## Integration Checklist (Future Phase)

When integrating layers (not yet required):
- Frontend calls → Java backend API (REST endpoints)
- Java backend ↔ SQL layer (JDBC or similar)
- UNIX scripts feed data to Java or SQL via pipes
- Maintain consistent entity definitions across all layers

---

## File Structure
```
used_car_buy_and_sell/
├── frontend/              # Vanilla HTML/CSS/JS
│   ├── css/styles.css
│   ├── js/auth.js        # User storage, auth helpers
│   ├── js/cars.js        # Car storage, CRUD helpers
│   ├── login.html        # Buyer login
│   ├── login-seller.html
│   ├── register.html
│   ├── buyer-home.html
│   ├── seller-dashboard.html
│   ├── car-listings.html
│   ├── car-details.html
│   └── add-car.html
├── java-backend/          # (Empty; awaiting implementation)
├── unix/                  # (Empty; awaiting implementation)
├── sql/                   # (Empty; awaiting implementation)
├── user-stories/          # CSV files per layer
├── CLAUDE.md              # Detailed project spec (read first)
└── .github/
    └── copilot-instructions.md (this file)
```

---

## Common Tasks

### Adding a New Feature
1. Create user stories in all four `user-stories/*.csv` files (same feature, different layer)
2. Implement feature independently in each layer
3. Keep entity definitions consistent (especially field names and types)
4. Ensure "SMART but SIMPLE" logic used (rule-based, not complex algorithms)

### Extending Entities
- Add new fields to entity definitions in CLAUDE.md
- Update flat file formats in UNIX layer
- Update all layer CSVs with related user stories
- Update frontend localStorage keys if new high-level concepts are added

### Testing
- **Frontend**: Manual browser testing; localStorage inspection in DevTools
- **Java**: Console output validation; test via Main menu
- **UNIX**: `bash <script>.sh` with test data files
- **SQL**: Run queries against test schema; check JOIN results

---

## See Also
- **CLAUDE.md** — Complete project spec, constraints, and design philosophy (read before starting any task)
- **user-stories/*.csv** — Current feature backlog per layer
- **USER STORIES.xlsx** — Consolidated view of all stories
