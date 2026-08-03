# Manara-Nexus — Backend API

Node.js + Express + MySQL REST API for the Manara-Nexus NGO Management System.

---

## Quick Start

```bash
# 1. Go to backend folder
cd backend

# 2. Install dependencies
npm install

# 3. Copy env file and fill in values
copy .env.example .env

# 4. Create MySQL database and run schema
mysql -u root -p < database/schema.sql

# 5. Seed sample data
npm run seed

# 6. Start development server
npm run dev

## Environment Variables (.env)

| Key | Description |
|---|---|
| `PORT` | Server port (default 5000) |
| `DB_HOST` | MySQL host |
| `DB_USER` | MySQL username |
| `DB_PASSWORD` | MySQL password |
| `DB_NAME` | Database name (`manara_nexus`) |
| `JWT_SECRET` | Secret key for JWT tokens |
| `JWT_EXPIRES_IN` | Token expiry (e.g. `7d`) |
| `RAZORPAY_KEY_ID` | Razorpay test key ID |
| `RAZORPAY_KEY_SECRET` | Razorpay test key secret |
| `FRONTEND_URL` | Frontend URL for CORS |
| `BCRYPT_ROUNDS` | Password hashing rounds (12) |

---

## API Endpoints

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| POST | `/api/auth/register/donor` | Register donor |
| POST | `/api/auth/register/volunteer` | Register volunteer |
| POST | `/api/auth/login`  Login all roles |
| POST | `/api/auth/logout` | Logout |
| GET  | `/api/auth/me` | Current user |
| GET  | `/api/profile` | Get profile |
| PUT  | `/api/profile`  Update profile |
| PUT  | `/api/profile/password` | Change password |
| GET  | `/api/campaigns` All campaigns |
| POST | `/api/campaigns` | Admin | Create campaign |
| PUT  | `/api/campaigns/:id` | Admin | Update campaign |
| DELETE | `/api/campaigns/:id` | Admin | Delete campaign |
| PATCH | `/api/campaigns/:id/status` | Admin | Set status |
| GET  | `/api/campaigns/:id/qr` | Get QR code |
| POST | `/api/donations` | Donor | Create donation |
| POST | `/api/donations/razorpay/order` | Donor | Razorpay order |
| POST | `/api/donations/razorpay/verify` | Donor | Verify payment |
| GET  | `/api/donations/my` | Donor | My donations |
| GET  | `/api/donations` | Admin | All donations |
| PATCH | `/api/donations/:id/verify` | Admin | Verify donation |
| PATCH | `/api/donations/:id/reject` | Admin | Reject donation |
| GET  | `/api/donations/:id/receipt` | PDF receipt |
| POST | `/api/items` | Donor | Donate item |
| GET  | `/api/items/my` | Donor | My items |
| GET  | `/api/items` | Admin | All items |
| PATCH | `/api/items/:id/status` | Admin | Update item status |
| GET  | `/api/tasks`  | Get tasks |
| POST | `/api/tasks` | Admin | Create task |
| PATCH | `/api/tasks/:id/status` | Admin/Vol | Update status |
| DELETE | `/api/tasks/:id` | Admin | Delete task |
| GET  | `/api/admin/dashboard` | Admin | Dashboard stats |
| GET  | `/api/admin/donors` | Admin | All donors |
| GET  | `/api/admin/volunteers` | Admin | All volunteers |
| GET  | `/api/admin/transactions` | Admin | Transactions |
| GET  | `/api/admin/messages` | Admin | Contact messages |
| DELETE | `/api/admin/users/:id` | Admin | Delete user |
| GET  | `/api/reports/donations` | Admin | Donation report |
| GET  | `/api/reports/campaigns` | Admin | Campaign report |
| GET  | `/api/reports/volunteers` | Admin | Volunteer report |
| GET  | `/api/reports/monthly` | Admin | Monthly report |
| GET  | `/api/notifications` | My notifications |
| PATCH | `/api/notifications/read-all` | Mark all read |
| POST | `/api/contact` |  Send message |
| GET  | `/api/health` |  Health check |

---

## Seed Credentials

| Role | Email | Password |
|---|---|---|
| Admin | admin@manara-nexus.org | Admin@123 |
| Donor | ravi@example.com | Donor@123 |
| Volunteer | neha@example.com | Vol@12345 |

---

## Tech Stack

- **Runtime:** Node.js
- **Framework:** Express.js
- **Database:** MySQL (mysql2/promise)
- **Auth:** JWT + bcryptjs
- **Payments:** Razorpay
- **PDF:** PDFKit
- **CSV:** csv-writer
- **QR:** qrcode
- **Docs:** Swagger UI + Postman Collection
- **Security:** Helmet, Rate Limiting, CORS, Input Validation
