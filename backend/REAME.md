# LetGO to ICC-CPT Backend API

## Overview

This backend powers a secure, admin-controlled trip booking system for church members and drivers. All user management is handled by admins—there is no public registration. The system uses JWT authentication, MongoDB, and supports OTP login for approved users.

---

## Key Features

- **Admin-Only User Management:**
  - Only admins can add, approve, edit, or remove members and drivers.
  - Admins can also add other admins.
  - No public registration—users must be added by an admin.
- **OTP Login:**
  - Approved users receive OTPs for login.
  - Blocked or pending users cannot log in.
- **Role-Based Access:**
  - Members: Book trips, view history, manage address, track drivers.
  - Drivers: View bookings, start trips, update availability.
  - Admins: Full control over all users and bookings.
- **Bootstrap Script:**
  - Use `bootstrapAdmin.ts` to create the first admin(s) directly in the database.
- **Booking & Address Management:**
  - Members can book one-way/round trips, select drivers, and set addresses.
- **Live Monitoring:**
  - Admins can view all users and bookings, and monitor live operations.

---

## Tech Stack

- Node.js & Express.js
- TypeScript
- MongoDB & Mongoose
- JWT (jsonwebtoken)
- dotenv (env config)
- nodemon, tsx (development tooling)
- CORS middleware

---

## Getting Started

### Prerequisites

- Node.js v16 or higher
- MongoDB instance (local or cloud)
- (Optional) Twilio account for SMS
- Create a `.env` file in the root directory with:

```
PORT=5000
MONGO_URI=mongodb://127.0.0.1:27017/LetGO_to_ICC-CPT
JWT_SECRET=<your-secret-key>
# Twilio (optional)
TWILIO_ACCOUNT_SID=
TWILIO_AUTH_TOKEN=
TWILIO_PHONE_NUMBER=
```

### Installation

Clone the repository:

```sh
git clone <your-repo-url>
cd backend
npm install
```

---

## Scripts

| Script                                  | Description                              |
| --------------------------------------- | ---------------------------------------- |
| `npm run dev`                           | Start development server (nodemon + tsx) |
| `npx tsx src/scripts/bootstrapAdmin.ts` | Create initial admin user(s)             |

---

## Usage Flow

1. **Bootstrap Admin:**
   - Run the bootstrap script to create the first admin(s).
2. **Admin Login:**
   - Admin logs in with phone number, receives OTP, verifies OTP to get JWT token.
3. **Admin Adds Users:**
   - Use `/api/admin/user` endpoint with JWT token to add members, drivers, or more admins.
4. **User Login:**
   - Approved users log in with phone number and OTP.
5. **Role-Based Actions:**
   - Members and drivers use their respective endpoints as allowed by their role.

---

## API Structure

- `src/index.ts` - Entry point of the application.
- `src/routes` - API route definitions for admin, users, bookings, and auth.
- `src/controllers` - Controller logic separated from routes.
- `src/models` - Mongoose models and schemas.
- `src/middleware` - Middleware for authentication, error handling, etc.
- `src/scripts` - CLI scripts for tasks like seeding admin users.

---

## Environment Variables

Configure your `.env` for:

- Database connection string
- JWT secret key
- (Optional) Twilio credentials for SMS
- Server port

---


## Contact

For any questions or support, please open an issue or contact the maintainer.

---

Happy coding!
