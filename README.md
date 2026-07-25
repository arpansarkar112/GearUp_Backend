# GearUp 🏋️
**"Rent Sports & Outdoor Gear Instantly"**

🚀 **Live API:** [Vercel Deployment](https://gear-up-backend-pi.vercel.app/)  
📄 **API Documentation:** [Postman Docs](https://documenter.getpostman.com/view/54908597/2sBY4QtKp2)  
💻 **Repository:** [GitHub](https://github.com/arpansarkar112/GearUp_Backend.git)

---

## 🔑 Admin Credentials (For Evaluation)
- **Email:** `admin@gearup.com`
- **Password:** `adminpassword123`

---

## 📖 Project Overview

GearUp is a robust backend API for a sports and outdoor equipment rental service. Customers can browse available gear, place rental orders, and pay securely via Stripe. Providers manage their gear inventory and fulfill rental orders. Admins oversee the entire platform, manage users, and moderate listings.

---

## 🛠️ Tech Stack

- **Runtime:** Node.js
- **Framework:** Express.js
- **Language:** TypeScript
- **Database:** PostgreSQL
- **ORM:** Prisma
- **Authentication:** JSON Web Tokens (JWT)
- **Validation:** Zod
- **Payment Gateway:** Stripe Integration

---

## 👥 Roles & Permissions

| Role | Description | Key Permissions |
|------|-------------|-----------------|
| **Customer** | Users who rent sports gear | Browse gear, place rental orders, track status, pay via Stripe, leave reviews |
| **Provider** | Gear vendors/rental shops | Manage gear inventory, view orders, update order status |
| **Admin** | Platform moderators | Manage all users, oversee all rentals, manage categories |

> 💡 **Note**: Users select their role during registration. Role-based Access Control (RBAC) is enforced on all private routes.

---

## ✨ Features

### Public Features
- Browse all available sports & outdoor gear.
- Search and filter by category, price, brand, and availability.
- View gear details with specifications.

### Customer Features
- Register and login as a customer.
- Place rental orders (select dates + items).
- **Make payments securely via Stripe** after the provider confirms the order.
- View payment history and track rental order status.
- Leave reviews after returning gear.

### Provider Features
- Register and login as a provider.
- Add, edit, and safely remove gear from inventory (utilizes Soft Delete to preserve order history).
- Manage stock and availability.
- View incoming rental orders.
- Update order status (`CONFIRMED`, `PICKED_UP`, `RETURNED`).

### Admin Features
- View all users (customers and providers).
- Manage user status (suspend/activate).
- View all gear listings and rental orders across the platform.
- Manage gear categories.

---

## 🗄️ Database Models

- **User**: Stores user information, authentication details, and RBAC roles.
- **GearItem**: Sports/outdoor gear listings (linked to provider, uses soft deletion).
- **Category**: Gear categories (e.g., cycling, camping, fitness).
- **RentalOrder**: Tracks order timelines, totals, and customer references.
- **RentalOrderItem**: Join table bridging multiple gears to a single order.
- **Payment**: Payment transactions handling Stripe metadata, amounts, and statuses.
- **Review**: Customer reviews for completed gear rentals.

---

## 🔄 Flow Diagrams

### 🏋️ Customer Journey

```text
                              ┌──────────────┐
                              │   Register   │
                              └──────────────┘
                                     │
                                     ▼
                              ┌──────────────┐
                              │ Browse Gear  │
                              └──────────────┘
                                     │
                                     ▼
                              ┌──────────────┐
                              │  View Gear   │
                              │   Details    │
                              └──────────────┘
                                     │
                                     ▼
                              ┌──────────────┐
                              │ Place Rental │
                              │    Order     │
                              └──────────────┘
                                     │
                                     ▼
                              ┌──────────────┐
                              │  Make Payment│
                              │   (Stripe)   │
                              └──────────────┘
                                     │
                                     ▼
                              ┌──────────────┐
                              │   Pick Up    │
                              │    Gear      │
                              └──────────────┘
                                     │
                                     ▼
                              ┌──────────────┐
                              │ Return Gear  │
                              │ Leave Review │
                              └──────────────┘


### 🏪 Provider Journey

```
                              ┌──────────────┐
                              │   Register   │
                              └──────────────┘
                                     │
                                     ▼
                              ┌──────────────┐
                              │  Add Gear    │
                              │  Inventory   │
                              └──────────────┘
                                     │
                                     ▼
                              ┌──────────────┐
                              │ Manage Stock │
                              └──────────────┘
                                     │
                                     ▼
                              ┌──────────────┐
                              │ View Orders  │
                              └──────────────┘
                                     │
                                     ▼
                              ┌──────────────┐
                              │Update Status │
                              └──────────────┘
```

### 📊 Rental Order Status

```
                              ┌──────────────┐
                              │    PLACED    │
                              └──────────────┘
                               /            \
                              /              \
                       (provider)       (customer)
                        confirms         cancels
                            /                \
                           ▼                  ▼
                    ┌──────────────┐   ┌──────────────┐
                    │  CONFIRMED   │   │  CANCELLED   │
                    └──────────────┘   └──────────────┘
                           │
                           ▼
                    ┌──────────────┐
                    │    PAID      │
                    │  (Stripe/    │
                    │  SSLCommerz) │
                    └──────────────┘
                           │
                           ▼
                    ┌──────────────┐
                    │  PICKED_UP   │
                    └──────────────┘
                           │
                           ▼
                    ┌──────────────┐
                    │  RETURNED    │
                    └──────────────┘
```
