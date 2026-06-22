# Smart Service Booking — Full Stack (Nexora)

A complete full-stack app: React (Vite) frontend + Node/Express backend + MongoDB,
with real authentication, 3 account types, and a role-restricted dashboard for each.

```
smart-service-booking/
  backend/    Express + MongoDB API (auth, services, bookings, categories, payments)
  frontend/   React + Vite + Tailwind (landing page + 3 dashboards)
```

## 1. Roles & access control

Every account is one of three roles, chosen at signup:

| Role | Can do |
|---|---|
| **Customer** | Browse services, book a provider, track/cancel own bookings |
| **Provider** | List/edit/delete own services, accept/decline/progress bookings made with them |
| **Admin** | See & manage **every** user, every booking, every category — the only role with platform-wide access |

**How access is enforced (not just hidden in the UI):**
- The backend checks the JWT on every request (`protect` middleware) and the role on every
  protected route (`authorize("customer")`, `authorize("provider","admin")`, etc.) — a customer
  token can never call a provider/admin-only endpoint, even by hitting the API directly.
- The frontend mirrors this with `ProtectedRoute`: if a customer tries to open
  `/dashboard/admin`, they're redirected straight back to their own dashboard.
- **Admin signup is gated by an invite code** (`ADMIN_SIGNUP_CODE` in `backend/.env`,
  default `NEXORA-ADMIN-2025`) so the public can't self-promote to admin through the
  normal signup form. Change this value before going live.
- Alternatively, create the first admin directly in the database with the seed script
  below — no code needed for that path.

## 2. Setup

### Prerequisites
- Node.js 18+
- MongoDB running locally (`mongodb://127.0.0.1:27017`) or a MongoDB Atlas connection string

### Backend

```bash
cd backend
npm install
npm run dev          # starts on http://localhost:5000
```

Create the first admin account (recommended over the invite-code signup for your real admin):

```bash
npm run seed:admin
```

This reads `SEED_ADMIN_NAME` / `SEED_ADMIN_EMAIL` / `SEED_ADMIN_PASSWORD` from `.env`
(defaults: `admin@nexora.com` / `Admin@12345`) — log in with those, then change the password.

Check `backend/.env` and update for your machine:

```
PORT=5000
MONGO_URI=mongodb://127.0.0.1:27017/smart-service-booking
JWT_SECRET=...
JWT_REFRESH_SECRET=...
ADMIN_SIGNUP_CODE=NEXORA-ADMIN-2025
CLIENT_URL=http://localhost:5173
```

### Frontend

```bash
cd frontend
npm install
npm run dev           # starts on http://localhost:5173
```

`frontend/.env` points it at the API:

```
VITE_API_URL=http://localhost:5000/api
```

## 3. Using the app

1. Open `http://localhost:5173` — this is the marketing landing page (same animated
   background, hover states, and theme toggle as before).
2. **Sign up** (top right) — pick **Customer**, **Service Provider**, or **Admin**
   (admin requires the invite code above).
3. You're redirected to the matching dashboard:
   - `/dashboard/customer` — browse services, book, track bookings
   - `/dashboard/provider` — add services, manage incoming bookings
   - `/dashboard/admin` — view all users/bookings, manage categories
4. As a provider, add a service before testing the customer booking flow — there's
   nothing to book otherwise. As admin, add a few categories first (Categories tab)
   so providers have something to pick from.

## 4. What's wired up end-to-end

- JWT auth (access + refresh token), bcrypt password hashing
- Register / Login / Logout / session restore on page refresh (`/auth/me`)
- Services: create/edit/delete (provider, or admin override), public browse + booking
- Bookings: create (customer) → accept/decline/progress (provider) → cancel (customer)
  → full oversight (admin)
- Categories: full CRUD, admin-only
- User management: admin can list and delete any account
- Every dashboard shows real stats pulled from MongoDB (counts, recent activity, earnings)

## 5. Notes

- Razorpay keys in `backend/.env` are **test** keys already in the original project;
  the payment endpoints (`/api/payments`) exist but aren't wired into the dashboard UI
  yet — bookings currently track `paymentStatus` without a live checkout flow.
- Socket.io is initialized on the backend for real-time notifications but the frontend
  doesn't subscribe to it yet — notifications are stored in MongoDB and ready to be
  surfaced if you want to add a bell icon later.
