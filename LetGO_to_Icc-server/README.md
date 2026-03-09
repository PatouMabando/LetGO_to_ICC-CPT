# Django Backend — LetGO to ICC-CPT

## Setup

1. **Create a virtual environment and activate it:**

   ```bash
   python -m venv icc-church
   # Windows
   icc-church\Scripts\activate

   # macOS/Linux
   source venv/bin/activate
   ```

2. **Install dependencies:**

   ```bash
   pip install -r requirements.txt
   ```

3. **Configure environment variables** — copy `.env.example` to `.env` and edit:

   ```bash
   cp .env.example .env
   ```

4. **Run migrations:**

   ```bash
   python manage.py migrate
   ```

5. **Bootstrap admin users:**

   ```bash
   python manage.py bootstrap_admin
   ```

6. **Run the development server:**
   ```bash
   python manage.py runserver
   ```
   The API will be available at `http://localhost:8000`.

## API Endpoints

### Auth (`/api/auth/`)

| Method | Path                  | Description                  |
| ------ | --------------------- | ---------------------------- |
| POST   | `/api/auth/login`     | Send OTP to phone number     |
| POST   | `/api/auth/verifyOtp` | Verify OTP and get JWT token |

### Admin (`/api/admin/`) — requires admin JWT

| Method | Path                                  | Description             |
| ------ | ------------------------------------- | ----------------------- |
| GET    | `/api/admin/members`                  | List all members        |
| GET    | `/api/admin/drivers`                  | List all drivers        |
| POST   | `/api/admin/user`                     | Add a user              |
| PUT    | `/api/admin/user/<id>`                | Edit a user             |
| DELETE | `/api/admin/user/<id>`                | Remove a user           |
| PATCH  | `/api/admin/user/<id>/status`         | Set user status         |
| PATCH  | `/api/admin/driver/<id>/availability` | Set driver availability |

### Bookings (`/api/bookings/`) — requires JWT

| Method | Path                              | Description           |
| ------ | --------------------------------- | --------------------- |
| POST   | `/api/bookings/`                  | Book a trip           |
| GET    | `/api/bookings/history`           | View booking history  |
| GET    | `/api/bookings/address`           | Get user address      |
| POST   | `/api/bookings/address`           | Set user address      |
| GET    | `/api/bookings/track/<bookingId>` | Track driver location |

### Driver (`/api/driver/`) — requires JWT

| Method | Path                       | Description                |
| ------ | -------------------------- | -------------------------- |
| GET    | `/api/driver/bookings`     | View driver booking counts |
| POST   | `/api/driver/start-trip`   | Start a trip               |
| PATCH  | `/api/driver/availability` | Update availability        |

## Database

Defaults to SQLite for development. Set `DATABASE_URL` in `.env` for PostgreSQL:

```
DATABASE_URL=postgres://user:password@localhost:5432/letgo_db
```
