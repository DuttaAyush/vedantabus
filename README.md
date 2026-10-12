# VedantaBus — Luxury Bus Ticketing & Tour Packages Platform
# Operated under Legal Venture: Vedanta Group Of Companies

[![Express 5.2.1](https://img.shields.io/badge/Express-5.2.1-green.svg)](https://expressjs.com/)
[![Next.js 16.3.5](https://img.shields.io/badge/Next.js-16.3.5-black.svg)](https://nextjs.org/)
[![Prisma 5.x](https://img.shields.io/badge/Prisma-5.x-blue.svg)](https://www.prisma.io/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-14%2B-blue.svg)](https://www.postgresql.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-blue.svg)](https://www.typescriptlang.org/)

VedantaBus (operated by Vedanta Group Of Companies) is an enterprise-grade luxury bus reservation and spiritual/domestic tour package booking platform. Built with a unified **Express 5** backend serving both a **Next.js customer portal** and an **administrative dashboard**.

---

## 🏗️ Architecture Overview

```
                      ┌──────────────────────────────────────────────┐
                      │           VedantaBus Monorepo                  │
                      └──────────────────────┬───────────────────────┘
                                             │
               ┌─────────────────────────────┼─────────────────────────────┐
               ▼                             ▼                             ▼
┌─────────────────────────────┐ ┌─────────────────────────────┐ ┌─────────────────────────────┐
│          FRONTEND           │ │           BACKEND           │ │            ADMIN            │
│       (Next.js 16.3)        │ │    (Express 5.2 + TS)       │ │       (Next.js 16.3)        │
│       Port: 3000            │ │        Port: 5000           │ │        Port: 3001           │
│                             │ │                             │ │                             │
│ • Bus search & filters      │ │ • Public / Search APIs      │ │ • KPI Dashboard & charts    │
│ • Interactive seat map      │ │ • Customer Auth & Profile   │ │ • Fleet & Bus management    │
│ • Two-phase seat locking    │ │ • Two-Phase Seat Lock Engine│ │ • Scheduled trips & seats   │
│ • Dynamic tour catalogs     │ │ • Unified Admin Gatekeeper  │ │ • Booking dossier & status  │
│ • Live bus tracking (PNR)   │ │ • PostgreSQL + Prisma ORM   │ │ • Customer dossier & desk   │
└──────────────┬──────────────┘ └──────────────┬──────────────┘ └──────────────┬──────────────┘
               │                               │                               │
               └──────────────────────► HTTP REST API ◄────────────────────────┘
                                               │
                                 ┌─────────────┴─────────────┐
                                 ▼                           ▼
                     ┌───────────────────────┐   ┌───────────────────────┐
                     │      PostgreSQL       │   │  Redis Seat Locking   │
                     │  (ACID Transactions)  │   │ (In-Memory Fallback)  │
                     └───────────────────────┘   └───────────────────────┘
```

---

## 📁 Repository Directory

| Folder | Technology | Port | Description |
|---|---|---|---|
| [`/BACKEND`](file:///d:/New%20folder/VedantaBus/BACKEND) | Node.js 20+, Express 5, TypeScript, Prisma | `5000` | Unified REST API server with two-phase seat locking, JWT auth, and admin gatekeeper |
| [`/FRONTEND`](file:///d:/New%20folder/VedantaBus/FRONTEND) | Next.js 16.3 (Turbopack), React 19, Tailwind CSS | `3000` | Customer-facing booking portal, search, seat selection, and tour package explorer |
| [`/ADMIN`](file:///d:/New%20folder/VedantaBus/ADMIN) | Next.js 16.3 (Turbopack), React 19 | `3001` | Administrative control panel for operations, fleet, bookings, trips, and analytics |
| [`BACKEND.md`](file:///d:/New%20folder/VedantaBus/BACKEND.md) | Markdown | — | Architectural decisions, database choices, gatekeeper design, and complete route directory |

---

## ⚡ Quick Start Guide

### 1. Prerequisites
- **Node.js**: `v20.x` or higher
- **PostgreSQL**: `v14.x` or higher
- **Redis** *(Optional)*: Recommended for production distributed locks; falls back automatically to an internal in-memory TTL map.

---

### 2. Backend Setup (`/BACKEND`)

```bash
cd BACKEND

# 1. Install dependencies
npm install

# 2. Configure environment
cp .env.example .env
# Edit .env with your PostgreSQL credentials and JWT secrets

# 3. Push database schema & generate Prisma Client
npx prisma generate
npx prisma db push

# 4. Seed initial database (admin user, test customer, routes, fleet, packages, offers)
npm run seed

# 5. Start development server
npm run dev
# Server will run on http://localhost:5000
```

---

### 3. Customer Portal Setup (`/FRONTEND`)

```bash
cd ../FRONTEND

# 1. Install dependencies
npm install

# 2. Copy environment template
cp .env.example .env.local

# 3. Start development server
npm run dev
# Customer site will run on http://localhost:3000
```

---

### 4. Admin Dashboard Setup (`/ADMIN`)

```bash
cd ../ADMIN

# 1. Install dependencies
npm install

# 2. Copy environment template
cp .env.example .env.local

# 3. Start development server
npm run dev
# Admin dashboard will run on http://localhost:3001
```

---

## 🔑 Default Seed Accounts

After running `npm run seed` in the `BACKEND` directory, log in with:

| Portal | URL | Role | Email | Password |
|---|---|---|---|---|
| **Admin Portal** | `http://localhost:3001` | `ADMIN` | `admin@VedantaBus.in` | `Password@123` |
| **Customer Portal** | `http://localhost:3000` | `USER` | `rahul.sharma@example.com` | `Password@123` |

---

## 🛡️ Key Solved Engineering Challenges

### 1. Double-Booking Prevention (The Seat Problem)
- Implemented a **Two-Phase Seat Locking Engine** (`BACKEND/src/utils/seatLock.ts`).
- When a user chooses seats in the UI, an atomic hold (`POST /api/bookings/hold`) locks the seat keys in Redis (`SET key holderId NX EX 600`) or in an in-memory TTL map.
- If another user attempts to select the same seat during checkout, the server immediately rejects the request with `409 Conflict`.
- Once payment is completed, the booking is committed to PostgreSQL in an ACID transaction, and the hold lock is released.
- If checkout is abandoned, the seat hold automatically self-expires after 10 minutes with zero database pollution or cron jobs.

### 2. Zero Hardcoding on Landing Pages & Catalogs
- All landing page components (`PopularRoutes`, `SpiritualPackages`, `DomesticPackages`, `InternationalPackages`, `YatraCatalog`, `IndiaLocalCatalog`, `InternationalCatalog`) fetch dynamic data from `/api/buses/routes`, `/api/packages`, and `/api/homepage/data`.
- Resilient client-side fallback ensures that even during temporary network interruptions, the UI renders gracefully.

### 3. Gatekeeper Security Architecture
- Public endpoints (`/api/buses/*`, `/api/packages/*`, `/api/homepage/*`, `/api/offers/*`) remain accessible without friction.
- Authenticated customer endpoints (`/api/users/*`, `/api/bookings/*`) enforce `authenticateJWT`.
- All administrative sub-routes under `/api/admin/*` are strictly guarded by a centralized gatekeeper checking both `authenticateJWT` and `isAdmin`. Any non-admin token receives `403 Forbidden`.

---

## 🧪 Production Verification

All three subsystems compile cleanly for production deployment:

```bash
# Verify Backend TypeScript compilation
cd BACKEND && npm run build       # Exits 0, compiles to dist/

# Verify Frontend Next.js build
cd ../FRONTEND && npm run build   # Exits 0, 19/19 routes compiled

# Verify Admin Next.js build
cd ../ADMIN && npm run build      # Exits 0, 21/21 routes compiled
```

---

## 📄 License
Proprietary software © 2026 Vedanta Group Of Companies. All rights reserved.
