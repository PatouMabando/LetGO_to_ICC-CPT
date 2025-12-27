# Backend API for Trip Booking Dashboard

## Overview

This project is the backend API for a role-based trip booking system. It provides RESTful endpoints for managing members, drivers, bookings, and admin operations. The API is built with Express.js and TypeScript, using MongoDB as the database via Mongoose ODM. It also integrates with Twilio for SMS notifications and uses JWT for authentication.

---

## Features

- User authentication with JWT (Members, Drivers, Admins)
- Secure password hashing with bcryptjs
- CRUD operations for users, bookings, and trips
- Admin seed script to bootstrap initial admin user
- SMS notifications integration with Twilio
- CORS enabled for cross-origin requests
- Environment-based configuration with dotenv
- TypeScript for static typing and improved code quality
- Nodemon and TSX for fast development iteration

---

## Tech Stack

- Node.js & Express.js (v5)
- TypeScript
- MongoDB & Mongoose
- JWT (jsonwebtoken)
- bcryptjs (password hashing)
- Twilio API (SMS messaging)
- dotenv (env config)
- nodemon, tsx, ts-node (development tooling)
- CORS middleware

---

## Getting Started

### Prerequisites

- Node.js v16 or higher
- MongoDB instance (local or cloud)
- Twilio account (for SMS integration)
- Create a `.env` file in the root directory with the following variables:

PORT=8000
MONGODB_URI=<your-mongodb-uri>
JWT_SECRET=<your-secret-key>
TWILIO_ACCOUNT_SID=<your-twilio-account-sid>
TWILIO_AUTH_TOKEN=<your-twilio-auth-token>
TWILIO_PHONE_NUMBER=<your-twilio-phone-number>


### Installation

Clone the repository
git clone <your-repo-url>
cd backend

Install dependencies
npm install



This command runs the server with `nodemon` and `tsx` for hot-reloading and TypeScript support.

---

## Scripts

| Script         | Description                       |
| -------------- | -------------------------------- |
| `npm run dev`  | Start development server (nodemon + tsx) |
| `npm run seed:admin` | Seed an initial admin user (bootstrapAdmin.ts) |

---

## API Structure

- `src/index.js` - Entry point of the application.
- `src/routes` - API route definitions for users, bookings, trips, and auth.
- `src/controllers` - Controller logic separated from routes.
- `src/models` - Mongoose models and schemas.
- `src/middleware` - Middleware for authentication, error handling, etc.
- `src/services` - Services such as notification handling (Twilio).
- `src/scripts` - CLI scripts for tasks like seeding an admin user.

---

## Environment Variables

Make sure to configure your `.env` properly for:

- Database connection string
- JWT secret key for token signing
- Twilio credentials for SMS functionality
- Server listening port

---

## Contributing

Contributions and pull requests are welcome! Please follow the existing coding style and write clear commit messages.

---

## License

This project is open source and available under the ISC license.

---

## Contact

For any questions or support, please open an issue or contact the maintainer.

---

Happy coding!
