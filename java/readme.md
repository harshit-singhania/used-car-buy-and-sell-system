# 🚗 Used Car Buy & Delivery System (Java CLI)

## 📌 Overview

This project is a **console-based Used Car Management System** built using **Core Java**.
It simulates a real-world car marketplace where users can register, login, browse cars, purchase vehicles, and track their orders.

The system is designed with **OOP principles**, **session management**, and **role-based access control (RBAC)**.

---

## 🎯 Features

### 🔐 Authentication & Session Management

* User Registration (Admin / Seller / Buyer)
* Secure Login & Logout
* Single active session at a time
* Access restricted without login

---

### 👥 Role-Based Access Control (RBAC)

| Role   | Permissions                       |
| ------ | --------------------------------- |
| Admin  | Full access (users, cars, orders) |
| Seller | Add, update, delete cars          |
| Buyer  | Browse, wishlist, purchase        |

---

### 🚗 Car Management

* Add new cars (Admin/Seller)
* Update car details
* Delete car listings
* Browse available cars
* View car details

---

### 🛒 Purchase & Order Tracking

* Buy available cars
* Automatic order creation
* Each order linked to a specific user
* View personal orders
* Admin can view all orders

---

### ❤️ Wishlist

* Add cars to wishlist
* Remove cars from wishlist
* View wishlist items

---

### 🕒 Recently Viewed

* Tracks recently viewed cars
* Helps users revisit options

---

## 🏗️ Project Structure

```
UsedCarSystem/
│
├── User.java           # User model (Encapsulation)
├── Car.java            # Car model
├── Order.java          # Order tracking model
├── SystemService.java  # Business logic (RBAC + Session)
├── Driver.java         # CLI interface (menu-driven)
```

---

## 🧠 Concepts Used

* Object-Oriented Programming (OOP)

  * Encapsulation (private variables + getters/setters)
  * Abstraction (service layer)
* ArrayList for data storage
* Role-Based Access Control (RBAC)
* Session Management (logged-in user tracking)
* Basic input/output handling

---

## 🔒 Security Features

* All instance variables are **private**
* Access controlled via **methods only**
* Login required for all protected operations
* Role validation before performing actions
* Duplicate user and car ID prevention

---

## ▶️ How to Run

### 1️⃣ Compile

```bash
javac *.java
```

### 2️⃣ Run

```bash
java Driver
```

---

## 🧪 Sample Flow

1. Register a user
2. Login
3. Add cars (Seller/Admin)
4. Browse cars
5. View details
6. Purchase car
7. Check "My Orders"

---

## ⚠️ Constraints

* Data is stored in memory (no database)
* Single-user session only
* CLI-based (no GUI)

---

## 🚀 Future Enhancements

* Convert to **Spring Boot REST API**
* Add **JWT Authentication**
* Integrate **MongoDB/MySQL**
* Build **Web UI (React/Angular)**
* Add **Payment Gateway simulation**
* Multi-user concurrent sessions

---

## 💡 Key Learning Outcomes

* Designing layered architecture
* Implementing authentication & authorization
* Managing state using session logic
* Writing clean, modular Java code

---

## 👨‍💻 Author

Developed as part of academic project on:
**Used Car Buy & Delivery System**

---

## 📄 License

This project is for educational purposes.
