# MANARA-NEXUS — NGO Management System
## Final Project Report

**Project Name:** Manara-Nexus  
**Type:** Full-Stack Web Application  
**Category:** NGO Management System  
**Date:** August 2026

---

## 1. PROJECT OVERVIEW

Manara-Nexus is a role-based NGO Management System that connects **Donors**, **Volunteers**, and **Administrators** on a single digital platform. The system enables transparent donation tracking, volunteer task management, campaign monitoring, and administrative reporting — all in one place.

The platform currently serves **4 cities** in India:
- Bengaluru
- Hyderabad
- Chennai
- Mumbai

---

## 2. PROBLEM STATEMENT

Traditional NGOs manage their operations manually — donor records in spreadsheets, volunteer coordination over phone calls, and donation receipts on paper. This leads to:

- No real-time visibility of donations
- Difficulty managing volunteers across multiple cities
- No transparent reporting for stakeholders
- Manual receipt generation causing delays
- No centralized platform for campaigns

**Manara-Nexus solves all of these problems** with a modern, digital, role-based platform.

---

## 3. OBJECTIVES

1. Build a secure, role-based web application for NGO management
2. Enable donors to donate money and items with full transaction history
3. Enable volunteers to view and manage tasks
4. Enable admins to manage donors, volunteers, campaigns, and generate reports
5. Integrate a real payment gateway (Razorpay) for online donations
6. Generate branded PDF donation receipts
7. Provide a professional public-facing landing page

---

## 4. TECH STACK

### Frontend
| Technology | Purpose |
|---|---|
| HTML5 | Page structure — semantic markup |
| CSS3 | Styling — custom animations, layouts |
| JavaScript (ES6) | Interactivity, API calls, DOM manipulation |
| Bootstrap 4 | Responsive grid and components |
| Font Awesome 6 | Icons across all pages |
| Google Fonts (Inter) | Typography |

### Backend
| Technology | Purpose |
|---|---|
| Node.js | JavaScript runtime environment |
| Express.js | Web framework — routing and middleware |
| Mongoose | MongoDB ODM — schema and query management |
| JWT (jsonwebtoken) | Authentication tokens |
| bcryptjs | Password hashing |
| Razorpay | Payment gateway integration |
| PDFKit | PDF receipt and report generation |
| csv-writer | CSV report export |
| qrcode | Dynamic QR code generation |
| Multer | File upload handling |
| Helmet | HTTP security headers |
| express-rate-limit | API rate limiting |
| express-validator | Input validation |
| Swagger UI | API documentation |
| Morgan | HTTP request logging |
| Nodemon | Development auto-restart |

### Database
| Technology | Purpose |
|---|---|
| MongoDB | NoSQL document database |
| MongoDB Atlas / Local | Database hosting |

---

## 5. SYSTEM ARCHITECTURE

```
┌─────────────────────────────────────────────┐
│                  BROWSER                     │
│         HTML + CSS + JavaScript              │
│      (19 Pages — Bootstrap 4 UI)             │
└──────────────────┬──────────────────────────┘
                   │  HTTP Requests (fetch API)
                   │  Authorization: Bearer JWT
                   ▼
┌─────────────────────────────────────────────┐
│           NODE.JS + EXPRESS.JS               │
│              REST API Server                 │
│           http://localhost:5000              │
│                                              │
│  ┌──────────┐ ┌──────────┐ ┌─────────────┐  │
│  │  Routes  │ │Middleware│ │ Controllers │  │
│  └──────────┘ └──────────┘ └─────────────┘  │
│  ┌──────────┐ ┌──────────┐ ┌─────────────┐  │
│  │  Models  │ │ Services │ │    Utils    │  │
│  └──────────┘ └──────────┘ └─────────────┘  │
└──────────────────┬──────────────────────────┘
                   │  Mongoose ODM
                   ▼
┌─────────────────────────────────────────────┐
│              MONGODB DATABASE                │
│           mongodb://localhost:27017          │
│              manara_nexus DB                 │
│  11 Collections — users, donors,            │
│  volunteers, campaigns, donations...         │
└─────────────────────────────────────────────┘
```

---

## 6. DATABASE DESIGN

### Collections (11 Total)

#### users
```
_id, name, email, password (hashed), phone, 
role (admin/donor/volunteer), city, is_active, 
createdAt, updatedAt
```

#### donors
```
_id, user_id (ref: User), address, bank_name, 
ifsc_code, account_number, total_donated, createdAt
```

#### volunteers
```
_id, user_id (ref: User), interests, dob, 
tasks_done, createdAt
```

#### admins
```
_id, user_id (ref: User), username, createdAt
```

#### campaigns
```
_id, admin_id (ref: User), title, description, 
target_amount, collected_amount, start_date, 
end_date, status, banner_image, city, createdAt
```

#### donations
```
_id, donor_id (ref: User), campaign_id (ref: Campaign),
amount, payment_mode, status, receipt_number,
transaction_ref, razorpay_order_id, 
razorpay_payment_id, razorpay_signature,
verified_by, verified_at, notes, createdAt
```

#### donated_items
```
_id, donor_id (ref: User), item_name, category,
quantity, item_condition, pickup_required, 
status, notes, createdAt
```

#### transactions
```
_id, donation_id (ref: Donation), donor_id (ref: User),
amount, type, description, createdAt
```

#### tasks
```
_id, campaign_id (ref: Campaign), assigned_by (ref: User),
assigned_to (ref: User), title, description,
priority, status, due_date, completed_at, createdAt
```

#### notifications
```
_id, user_id (ref: User), type, title, message,
is_read, ref_id, ref_type, createdAt
```

#### contact_messages
```
_id, name, email, subject, message, is_read, createdAt
```

---

## 7. FOLDER STRUCTURE

```
NGO-Management-System/
│
├── frontend/                        ← All UI pages
│   ├── index.html                   ← Landing page
│   ├── assets/
│   │   ├── css/style.css            ← Custom CSS
│   │   └── js/
│   │       ├── api.js               ← API utility (shared)
│   │       └── script.js            ← Animations, slider
│   ├── login/
│   │   ├── adminLogin.html
│   │   ├── donorLogin.html
│   │   └── volunteerLogin.html
│   ├── signup/
│   │   ├── adminSignup.html
│   │   ├── donorSignup.html
│   │   └── volunteerSignup.html
│   ├── dashboard/
│   │   ├── adminDashboard.html
│   │   ├── adminVolunteers.html
│   │   ├── donorDashboard.html
│   │   └── volunteerDashboard.html
│   ├── donor/
│   │   ├── details.html
│   │   ├── donateMoney.html
│   │   ├── donateItems.html
│   │   └── transactions.html
│   ├── volunteer/
│   │   └── tasks.html
│   └── update/
│       ├── adminUpdate.html
│       ├── donorUpdate.html
│       └── volunteerUpdate.html
│
├── backend/
│   ├── config/
│   │   ├── db.js                    ← MongoDB connection
│   │   └── swagger.js               ← Swagger config
│   ├── controllers/
│   │   ├── authController.js
│   │   ├── adminController.js
│   │   ├── campaignController.js
│   │   ├── donationController.js
│   │   ├── itemController.js
│   │   ├── taskController.js
│   │   ├── profileController.js
│   │   ├── notificationController.js
│   │   ├── contactController.js
│   │   └── reportController.js
│   ├── middleware/
│   │   ├── auth.js                  ← JWT protect + authorize
│   │   ├── errorHandler.js
│   │   ├── upload.js                ← Multer file upload
│   │   └── validate.js              ← Input validation
│   ├── models/
│   │   ├── User.js
│   │   ├── Admin.js
│   │   ├── Donor.js
│   │   ├── Volunteer.js
│   │   ├── Campaign.js
│   │   ├── Donation.js
│   │   ├── DonatedItem.js
│   │   ├── Transaction.js
│   │   ├── Task.js
│   │   ├── Notification.js
│   │   └── ContactMessage.js
│   ├── routes/
│   │   ├── authRoutes.js
│   │   ├── adminRoutes.js
│   │   ├── campaignRoutes.js
│   │   ├── donationRoutes.js
│   │   ├── itemRoutes.js
│   │   ├── taskRoutes.js
│   │   ├── profileRoutes.js
│   │   ├── notificationRoutes.js
│   │   ├── contactRoutes.js
│   │   └── reportRoutes.js
│   ├── services/
│   │   ├── notificationService.js
│   │   ├── pdfService.js
│   │   └── csvService.js
│   ├── database/
│   │   └── seeder.js
│   ├── docs/
│   │   └── postman_collection.json
│   ├── uploads/
│   │   ├── banners/
│   │   ├── items/
│   │   └── receipts/
│   ├── app.js
│   ├── server.js
│   ├── .env
│   └── .env.example
│
├── bootstrap/                       ← Bootstrap 4 assets
├── images/                          ← Project images
├── sql/                             ← Reference schema
└── FINAL_REPORT.md                  ← This file
```

---

## 8. API ENDPOINTS (40+)

### Authentication
| Method | Endpoint | Auth | Description |
|---|---|---|---|
| POST | `/api/auth/register/donor` | Register new donor |
| POST | `/api/auth/register/volunteer` |  Register new volunteer |
| POST | `/api/auth/register/admin`  Register new admin |
| POST | `/api/auth/login` |  Login all roles |
| POST | `/api/auth/logout`  Logout |
| GET | `/api/auth/me` |  Get current user |

### Profile
| Method | Endpoint | Auth | Description |
|---|---|---|---|
| GET | `/api/profile` |  Get profile |
| PUT | `/api/profile`  Update profile |
| PUT | `/api/profile/password`  | Change password |

### Campaigns
| Method | Endpoint | Auth | Description |
|---|---|---|---|
| GET | `/api/campaigns`  All campaigns |
| GET | `/api/campaigns/:id` |  | Single campaign |
| GET | `/api/campaigns/:id/qr` | | QR code |
| POST | `/api/campaigns` | Admin | Create campaign |
| PUT | `/api/campaigns/:id` | Admin | Update campaign |
| DELETE | `/api/campaigns/:id` | Admin | Delete campaign |
| PATCH | `/api/campaigns/:id/status` | Admin | Set status |

### Donations
| Method | Endpoint | Auth | Description |
|---|---|---|---|
| POST | `/api/donations` | Donor | Create donation |
| POST | `/api/donations/razorpay/order` | Donor | Create Razorpay order |
| POST | `/api/donations/razorpay/verify` | Donor | Verify payment |
| GET | `/api/donations/my` | Donor | My donations |
| GET | `/api/donations/:id/receipt` || PDF receipt |
| GET | `/api/donations` | Admin | All donations |
| PATCH | `/api/donations/:id/verify` | Admin | Verify donation |
| PATCH | `/api/donations/:id/reject` | Admin | Reject donation |

### Items, Tasks, Admin, Reports
| Method | Endpoint | Auth | Description |
|---|---|---|---|
| POST | `/api/items` | Donor | Donate item |
| GET | `/api/items/my` | Donor | My items |
| GET | `/api/items` | Admin | All items |
| GET | `/api/tasks` |  Get tasks |
| POST | `/api/tasks` | Admin | Create task |
| PATCH | `/api/tasks/:id/status` | Admin/Vol | Update status |
| GET | `/api/admin/dashboard` | Admin | Stats |
| GET | `/api/admin/donors` | Admin | All donors |
| GET | `/api/admin/volunteers` | Admin | All volunteers |
| GET | `/api/reports/donations` | Admin | Donation report |
| GET | `/api/reports/campaigns` | Admin | Campaign report |
| GET | `/api/reports/volunteers` | Admin | Volunteer report |
| GET | `/api/reports/monthly` | Admin | Monthly report |
| GET | `/api/notifications` | Notifications |
| POST | `/api/contact`  | Contact message |
| GET | `/api/health` | Health check |

---

## 9. FEATURES

### Public (No Login)
- Professional landing page with hero image slider
- About, Programs, Campaigns, Gallery sections
- Impact statistics with counter animation
- Contact form connected to backend
- Campaign progress bars with real data

### Admin Module
- Dashboard with live statistics (donors, volunteers, donations, pending)
- City-wise donor management with filter
- Volunteer management
- Donation approve / reject
- Campaign create, update, delete, activate/deactivate
- Task create and assign to volunteers
- View all transactions
- Read contact messages
- Export reports (PDF + CSV) — Donation, Campaign, Volunteer, Monthly
- Edit profile

### Donor Module
- Register and login
- Fill bank details
- Donate money (Cash / UPI / Bank Transfer / Cheque / Online via Razorpay)
- Donate items with condition and pickup option
- View transaction history with status
- Download PDF receipt for each donation
- Edit profile (bank details, address, city)

### Volunteer Module
- Register and login
- View all running tasks
- View tasks assigned to me
- Mark task as completed
- Add new tasks
- Edit profile (interests, DOB, city)

---

## 10. SECURITY IMPLEMENTATION

| Security Feature | Implementation |
|---|---|
| Password Hashing | bcryptjs with 12 rounds |
| Authentication | JWT tokens (7 day expiry) |
| Authorization | Role-based middleware (`authorize('admin')`) |
| Input Validation | express-validator on all routes |
| Rate Limiting | 20 req/15min on auth, 200 req/15min global |
| HTTP Headers | Helmet middleware |
| CORS | Only allowed origins (localhost:3000, 5500) |
| File Upload | Type validation (jpg/png/pdf), 5MB max |
| Error Handling | Centralized error middleware, no stack traces in production |

---

## 11. PAYMENT FLOW (Razorpay)

```
Donor enters amount
        ↓
POST /api/donations/razorpay/order
        ↓
Backend creates Razorpay order → returns order_id
        ↓
Frontend opens Razorpay popup
        ↓
User pays → Razorpay returns signature
        ↓
POST /api/donations/razorpay/verify
        ↓
Backend verifies HMAC-SHA256 signature
        ↓
Donation marked verified → Campaign amount updated
        ↓
Transaction created → Notification sent → PDF available
```

---

## 12. HOW TO RUN

### Prerequisites
- Node.js v18+
- MongoDB running on localhost:27017
- Python 3 (for frontend server)

### Step 1 — Setup Backend
```bash
cd backend
npm install
copy .env.example .env
# Edit .env — fill MongoDB URI and JWT secret
npm run seed
npm run dev
```

### Step 2 — Start Frontend
```bash
cd frontend
python -m http.server 3000
```

### Step 3 — Open Browser
| What | URL |
|---|---|
| Website | http://localhost:3000/index.html |
| API | http://localhost:5000/api/health |
| Swagger Docs | http://localhost:5000/api/docs |

### Test Credentials
| Role | Email | Password |
|---|---|---|
| Admin | admin@manara-nexus.org | Admin@123 |
| Donor | ravi@example.com | Donor@123 |
| Volunteer | neha@example.com | Vol@12345 |

---

## 13. PROJECT USPs

1. **Role-Based Access Control** — 3 roles, 3 dashboards, protected routes
2. **Real Payment Gateway** — Razorpay with HMAC signature verification
3. **PDF Receipt Generation** — Branded receipts with PDFKit
4. **QR Code Donations** — Scan to donate for any campaign
5. **Decoupled Architecture** — Frontend and Backend completely separate
6. **4 Report Types** — Donation, Campaign, Volunteer, Monthly in PDF + CSV
7. **Professional Landing Page** — Hero slider, animations, all sections
8. **Scalable Design** — Easy to add new cities, roles, features
9. **Security First** — Helmet, Rate Limiting, bcrypt, JWT, CORS
10. **Swagger + Postman** — Full API documentation

---

## 14. FUTURE SCOPE

- Email notifications via Nodemailer
- SMS alerts via Twilio
- Mobile app (React Native)
- Admin analytics dashboard with charts
- Multi-language support (Hindi, Tamil, Telugu)
- Automated tax receipt generation (80G)
- Volunteer hours tracking
- Donor leaderboard

---

## 15. CONCLUSION

Manara-Nexus is a complete, production-ready NGO management platform that solves real problems faced by non-profit organizations. It demonstrates full-stack development skills including REST API design, database modeling, payment integration, PDF generation, role-based security, and modern UI development.

The project follows industry best practices — MVC architecture, clean code, input validation, error handling, and API documentation — making it suitable for real-world deployment.

---

*Manara-Nexus © 2026 | Built with Node.js, Express, MongoDB, HTML/CSS/JS*
