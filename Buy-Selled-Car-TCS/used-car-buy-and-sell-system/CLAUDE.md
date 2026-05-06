# Used Car Buy and Sell Management System

## Project Overview
TCS ILP Sprint 1 project — a Used Car Marketplace system designed to score 100%. Built across four independent layers (not yet integrated). The system goes beyond basic CRUD by including smart, rule-based features that are simple to implement but appear innovative.

## Project Structure
```
used_car_buy_and_sell/
├── frontend/          # HTML, CSS, Vanilla JS (no frameworks)
├── java-backend/      # Core Java console app (no Spring Boot, no DB)
├── unix/              # Shell scripts using flat files (awk, grep, sort, wc)
├── sql/               # Schema definitions and queries
├── user-stories/      # CSV files per layer (one CSV per layer)
└── CLAUDE.md
```

## Tech Stack & Constraints
- **Frontend**: HTML5, CSS3, Vanilla JavaScript only. LocalStorage for persistence. No frameworks, no libraries.
- **Java Backend**: Core Java only. ArrayList for in-memory storage. Menu-driven console app. No Spring Boot, no database.
- **UNIX**: Flat files (cars.txt, users.txt, purchases.txt). Commands: awk, grep, sort, wc, sed. No Python/Perl.
- **SQL**: CREATE TABLE, SELECT, INSERT, UPDATE, DELETE, JOIN queries. MySQL syntax. Schema only — not connected to app.

## Core Entities
- **Users**: id, name, email, phone, role (buyer/seller), registrationDate
- **Cars**: id, make, model, year, price, mileage, fuelType, transmission, color, sellerId, status (available/sold), healthScore, fraudFlag, listingDate
- **Purchases**: id, carId, buyerId, sellerId, purchaseDate, amount
- **Wishlists**: id, userId, carId, addedDate
- **Reviews**: id, sellerId, buyerId, rating, comment, reviewDate
- **RecentlyViewed**: userId, carId, viewedDate

## Required Advanced Features (Must Appear in ALL Layers)
These features must be consistently implemented across frontend, Java, UNIX, and SQL:

1. **Car Recommendation System** — Filter cars by user's price range, preferred fuel type, or brand. Simple conditional matching logic.
2. **Wishlist / Saved Cars** — Users can save cars to a wishlist and retrieve them later.
3. **Recently Viewed Cars** — Track and display the last N cars a user viewed.
4. **Car Health Score** — Derived score from year, mileage, and fuel type. Formula: `score = 100 - (currentYear - carYear) * 3 - (mileage / 10000) * 2`. Clamped between 0–100.
5. **Fraud Detection Flag** — Flag listings where price deviates >40% from average price for same make+year. Simple average comparison.
6. **Seller Rating System** — Average rating from buyer reviews. Display alongside seller info.
7. **Smart Search & Filtering** — Multi-criteria filtering by price range, brand, fuel type, year range, transmission.
8. **Purchase History & Analytics** — Track purchases and show summary stats (total spent, cars bought, etc.).

## Design Philosophy
"SMART but SIMPLE" — Features that look innovative but are implementable with:
- Simple if/else conditions
- Basic arithmetic (averages, percentages)
- Array filtering and sorting
- Derived/calculated fields
- Rule-based logic (thresholds, comparisons)

## User Story CSV Format
```
SlNo,Feature,Story Number,Description (Card),Acceptance Criteria
```
- Story numbers: US001, US002, ...
- Description format: "As a <user>, I want <goal> so that <reason>"
- Acceptance criteria: detailed, semicolon-separated, implementable requirements
- Minimum 8–10 stories per layer
- Same features must appear across all four layer CSVs

## Coding Conventions
- **Frontend**: kebab-case for files, camelCase for JS variables, semantic HTML
- **Java**: PascalCase for classes, camelCase for methods, packages under `com.usedcar`
- **UNIX**: snake_case for script names, .sh extension, pipe-delimited flat files
- **SQL**: UPPERCASE for keywords, snake_case for table/column names

## Flat File Formats (UNIX Layer)
```
# cars.txt (pipe-delimited)
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

## Commands
- **Frontend**: Open `frontend/index.html` in browser
- **Java**: `javac *.java && java Main` from java-backend/
- **UNIX**: `bash unix/<script>.sh` from project root
- **SQL**: Run in any MySQL-compatible client

## Output Rules
- User story output: CSV only, no markdown, no explanation
- Code: clean, commented where logic is non-obvious
- All layers must be independently runnable
