# Let's Go to ICC CPT — Frontend

## Overview

React frontend for the **Let's Go to ICC CPT** church transportation app. Members can book rides, drivers manage their availability and trips, and admins manage all users and bookings through a dedicated dashboard. The frontend talks to a **Django REST Framework** backend via JSON APIs.

## Tech Stack

| Layer     | Technology                                           |
| --------- | ---------------------------------------------------- |
| Framework | React 19 + TypeScript                                |
| Build     | Vite 7                                               |
| UI        | Material UI (MUI) 7, Emotion                         |
| Routing   | React Router DOM 7                                   |
| Forms     | React Hook Form + Zod validation                     |
| State     | React Context (`AuthContext`) + Zustand (auth store) |
| Maps      | Leaflet / React Leaflet                              |
| Toasts    | react-hot-toast                                      |
| Icons     | MUI Icons, Lucide React                              |

## Prerequisites

- **Node.js** v18+ and npm
- **Django backend** running on `http://localhost:8000` (see backend README)

## Getting Started

```bash
# 1. Navigate to the frontend folder
cd frontend

# 2. Install dependencies
npm install

# 3. Start the dev server (runs on http://localhost:5173)
npm run dev
```

The app expects the backend at `http://localhost:8000` by default. To override, create a `.env` file:

```
VITE_API_URL=http://localhost:8000
```

## Running the Full Stack

```bash
# Terminal 1 — Start the Django backend
cd backend
..\icc-church\Scripts\Activate.ps1   # activate virtual env (Windows)
python manage.py runserver 8000

# Terminal 2 — Start the React frontend
cd frontend
npm run dev
```

Then open **http://localhost:5173** in your browser.

## Project Structure

```
src/
├── api/                  # API client modules
│   ├── index.ts          # BASE URL + asJson helper
│   ├── auth.ts           # Login / Verify OTP calls
│   └── admin.ts          # Admin API (members, drivers, admins, stats)
├── auth/                 # Auth guards (AuthCheck, RequireRole)
├── components/           # Shared UI components (Header, Layout, MapComponent, etc.)
├── context/
│   └── AuthContext.tsx    # Primary auth state (token, user, role)
├── store/
│   └── auth-store.ts     # Zustand auth store (alternative)
├── pages/
│   ├── LoginPage.tsx      # Phone number + OTP login
│   ├── Register.tsx       # New user registration
│   ├── VerifyOtpPage.tsx  # OTP verification
│   ├── HomePage.tsx       # Landing page
│   ├── BookingsPage.tsx   # Booking list (member view)
│   └── admin/
│       ├── AdminLayout.tsx  # Sidebar layout for admin
│       ├── AdminHome.tsx    # Dashboard with stats + recent users
│       ├── MembersPage.tsx  # Manage members (CRUD + status)
│       ├── DriversPage.tsx  # Manage drivers (CRUD + status + availability)
│       └── AdminPage.tsx    # Manage administrators
├── sections/             # Home page sections (Hero, Benefits, Booking, Footer)
├── theme/                # MUI theme + colors
├── validations/          # Zod schemas for form validation
└── lib/                  # Router config + routes + common helpers
```

## API Endpoints Used

All requests go to `{VITE_API_URL}/api/...` with a `Bearer` JWT token.

### Auth

| Method | Endpoint              | Description                    |
| ------ | --------------------- | ------------------------------ |
| POST   | `/api/auth/login`     | Send OTP to phone number       |
| POST   | `/api/auth/verifyOtp` | Verify OTP, receive JWT + user |

### Admin

| Method | Endpoint                             | Description                |
| ------ | ------------------------------------ | -------------------------- |
| GET    | `/api/admin/stats`                   | Dashboard stat counts      |
| GET    | `/api/admin/members`                 | List all members           |
| GET    | `/api/admin/drivers`                 | List all drivers           |
| GET    | `/api/admin/admins`                  | List all admins            |
| POST   | `/api/admin/user`                    | Add new user               |
| PUT    | `/api/admin/user/:id`                | Edit user                  |
| DELETE | `/api/admin/user/:id`                | Delete user                |
| PATCH  | `/api/admin/user/:id/status`         | Change user status         |
| PATCH  | `/api/admin/driver/:id/availability` | Toggle driver availability |

### Bookings

| Method   | Endpoint                | Description                      |
| -------- | ----------------------- | -------------------------------- |
| POST     | `/api/bookings/`        | Create a booking                 |
| GET      | `/api/bookings/history` | Booking history for current user |
| GET/POST | `/api/bookings/address` | Get or update saved address      |

### Driver

| Method | Endpoint                   | Description                 |
| ------ | -------------------------- | --------------------------- |
| GET    | `/api/driver/bookings`     | Bookings assigned to driver |
| POST   | `/api/driver/start-trip`   | Start a trip                |
| PATCH  | `/api/driver/availability` | Update own availability     |

## Authentication Flow

1. User enters phone number → `POST /api/auth/login` sends an OTP via SMS (or logs to console in dev mode)
2. User enters OTP → `POST /api/auth/verifyOtp` returns a JWT token + user object
3. Token is stored in `localStorage` and sent as `Authorization: Bearer <token>` on every request
4. `AuthContext` provides `user`, `token`, `role` to the entire app
5. Routes are protected by role: `member`, `driver`, or `admin`

## Admin Dashboard

The admin panel (`/admin/*`) includes:

- **Home** — live stats (approved/pending members, drivers, admins) + recent user lists
- **Members** — table of all members with status dropdown, edit, and delete
- **Drivers** — table with status, availability toggle, and vehicle info
- **Administrators** — manage other admin accounts

All admin pages fetch real data from the API on mount and perform optimistic updates with rollback on error.

## Scripts

| Script            | Description                       |
| ----------------- | --------------------------------- |
| `npm run dev`     | Start Vite dev server (port 5173) |
| `npm run build`   | Type-check + production build     |
| `npm run preview` | Preview the production build      |
| `npm run lint`    | Run ESLint                        |

## License

MIT
