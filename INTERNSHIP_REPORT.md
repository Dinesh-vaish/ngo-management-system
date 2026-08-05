# INTERNSHIP PROJECT REPORT

---

**Project Title:** Manara-Nexus — NGO Management System  
**Submitted By:** Dinesh Vaish  
**Institution:** [Your College Name]  
**Department:** [Your Department]  
**Academic Year:** 2025–2026  
**Internship Duration:** [Start Date] to [End Date]  
**Submitted To:** [Guide/HOD Name]

---

## CERTIFICATE

*This is to certify that the internship project titled **"Manara-Nexus — NGO Management System"** has been successfully completed. The work described in this report is the original work carried out by the student during the internship period.*

---

## DECLARATION

*I hereby declare that the project work titled "Manara-Nexus — NGO Management System" submitted for the internship report is my own original work. The information and data used in this report have not been submitted elsewhere for any other degree or diploma.*

**Signature:** ___________________  
**Date:** August 2026

---

## ACKNOWLEDGEMENT

I would like to express my sincere gratitude to my college faculty and mentors for their constant guidance and support throughout this internship. This project gave me the opportunity to apply theoretical knowledge to a real-world problem and develop practical skills in full-stack web development.

---

## TABLE OF CONTENTS

1. Introduction
2. Problem Statement
3. Objectives
4. Technology Stack
5. System Architecture
6. Database Design
7. Module Description
8. Implementation
9. API Documentation
10. Security Features
11. Testing
12. Challenges Faced
13. Learning Outcomes
14. Conclusion
15. References

---

## CHAPTER 1 — INTRODUCTION

### 1.1 Overview

Manara-Nexus is a full-stack, role-based NGO Management System developed as part of the internship project. It is a web-based platform designed to digitize and streamline the operations of a Non-Governmental Organization (NGO).

The system provides a unified digital platform for three types of users — **Administrators**, **Donors**, and **Volunteers** — enabling transparent donation management, volunteer coordination, campaign monitoring, and automated report generation.

### 1.2 Background

Non-Governmental Organizations play a vital role in society by addressing issues like poverty, education, healthcare, and disaster relief. However, most NGOs in India still rely on manual processes for managing donations, volunteers, and campaigns. This leads to:

- Loss of donor records
- No real-time visibility of funds
- Difficulty in coordinating volunteers
- Manual and time-consuming report generation
- Lack of transparency for stakeholders

### 1.3 Scope

The system is currently designed to serve **4 major cities** in India:
- Bengaluru
- Hyderabad
- Chennai
- Mumbai

It supports complete donation lifecycle management, volunteer task management, campaign tracking, and administrative reporting.

---

## CHAPTER 2 — PROBLEM STATEMENT

Traditional NGOs face the following challenges:

| Problem | Impact |
|---|---|
| Manual donation records | Data loss, errors |
| No online payment option | Fewer donations |
| Volunteer coordination via phone | Inefficiency |
| Paper donation receipts | Delay, loss |
| No centralized reporting | Poor transparency |
| No campaign tracking | Missed goals |

**Manara-Nexus addresses all these problems** by providing a secure, digital, role-based management platform.

---

## CHAPTER 3 — OBJECTIVES

The primary objectives of this project are:

1. Develop a secure, role-based web application for NGO operations
2. Enable online donations with Razorpay payment gateway integration
3. Automate PDF donation receipt generation
4. Provide volunteer task management with status tracking
5. Enable city-wise donor management for administrators
6. Generate downloadable reports (PDF and CSV formats)
7. Build a professional public-facing website for the NGO
8. Implement industry-standard security practices

---

## CHAPTER 4 — TECHNOLOGY STACK

### 4.1 Frontend Technologies

| Technology | Version | Purpose |
|---|---|---|
| HTML5 | Latest | Page structure and semantic markup |
| CSS3 | Latest | Styling, animations, responsive design |
| JavaScript | ES6+ | Interactivity, API calls, DOM manipulation |
| Bootstrap | 4.x | Responsive grid system and UI components |
| Font Awesome | 6.5 | Icons across all pages |
| Google Fonts | Inter | Professional typography |

### 4.2 Backend Technologies

| Technology | Version | Purpose |
|---|---|---|
| Node.js | 18+ | JavaScript runtime environment |
| Express.js | 4.x | Web framework for REST API |
| Mongoose | 7.x | MongoDB Object Data Modeling |
| JSON Web Token | 9.x | Stateless authentication |
| bcryptjs | 2.x | Password hashing |
| Razorpay | 2.x | Payment gateway integration |
| PDFKit | 0.14 | PDF generation |
| csv-writer | 1.6 | CSV export |
| qrcode | 1.5 | Dynamic QR code generation |
| Multer | 2.x | File upload handling |
| Helmet | 7.x | HTTP security headers |
| express-rate-limit | 7.x | API rate limiting |
| express-validator | 7.x | Input validation |
| Swagger UI | 5.x | API documentation |
| Morgan | 1.x | HTTP request logging |
| Nodemon | 3.x | Development auto-restart |

### 4.3 Database

| Technology | Purpose |
|---|---|
| MongoDB | NoSQL document database |
| MongoDB Compass | GUI for database management |

### 4.4 Tools Used

| Tool | Purpose |
|---|---|
| VS Code | Code editor |
| Postman | API testing |
| Git & GitHub | Version control |
| Chrome DevTools | Frontend debugging |

---

## CHAPTER 5 — SYSTEM ARCHITECTURE

### 5.1 Architecture Diagram

```
┌──────────────────────────────────────────────┐
│              CLIENT (Browser)                 │
│         HTML + CSS + JavaScript               │
│    19 Pages — Bootstrap 4 + Font Awesome      │
└─────────────────┬────────────────────────────┘
                  │ HTTP Requests
                  │ JWT Token in Header
                  ▼
┌──────────────────────────────────────────────┐
│         EXPRESS.JS REST API SERVER            │
│           http://localhost:5000               │
│                                               │
│  ┌─────────┐  ┌──────────┐  ┌─────────────┐  │
│  │  Routes │  │Middleware│  │ Controllers │  │
│  └─────────┘  └──────────┘  └─────────────┘  │
│  ┌─────────┐  ┌──────────┐  ┌─────────────┐  │
│  │ Models  │  │ Services │  │   Config    │  │
│  └─────────┘  └──────────┘  └─────────────┘  │
└─────────────────┬────────────────────────────┘
                  │ Mongoose ODM
                  ▼
┌──────────────────────────────────────────────┐
│            MONGODB DATABASE                   │
│         mongodb://localhost:27017             │
│           Database: manara_nexus              │
│    11 Collections — users, donors,            │
│    volunteers, campaigns, donations...        │
└──────────────────────────────────────────────┘
```

### 5.2 MVC Architecture

The backend follows the **MVC (Model-View-Controller)** pattern:

- **Model** — Mongoose schemas defining data structure (User, Donor, Campaign, etc.)
- **View** — Frontend HTML pages (served separately)
- **Controller** — Business logic handling API requests and responses
- **Routes** — URL mapping to controllers

### 5.3 Authentication Flow

```
User submits login form
        ↓
POST /api/auth/login
        ↓
Backend verifies email + bcrypt password comparison
        ↓
JWT token generated (7 day expiry)
        ↓
Token stored in localStorage
        ↓
Every API request → Authorization: Bearer <token>
        ↓
auth.js middleware verifies token
        ↓
req.user set → Controller executes
```

---

## CHAPTER 6 — DATABASE DESIGN

### 6.1 Collections Overview

The database contains **11 collections** with proper references between them.

### 6.2 Schema Details

#### users (Base collection for all roles)
```
Field       Type      Description
_id         ObjectId  Primary key
name        String    Full name
email       String    Unique email address
password    String    bcrypt hashed password
phone       String    Mobile number
role        Enum      admin / donor / volunteer
city        Enum      Bengaluru/Hyderabad/Chennai/Mumbai
is_active   Boolean   Account status
createdAt   Date      Auto timestamp
```

#### campaigns
```
Field             Type      Description
admin_id          Ref:User  Created by admin
title             String    Campaign title
target_amount     Number    Fundraising goal
collected_amount  Number    Amount raised so far
status            Enum      active/inactive/completed/cancelled
banner_image      String    File path
start_date        Date      Campaign start
end_date          Date      Campaign end
```

#### donations
```
Field               Type        Description
donor_id            Ref:User    Donor reference
campaign_id         Ref:Campaign Campaign reference
amount              Number      Donation amount
payment_mode        Enum        cash/upi/bank/cheque/online
status              Enum        pending/verified/rejected
receipt_number      String      Unique auto-generated
razorpay_order_id   String      For online payments
razorpay_payment_id String      Payment confirmation
verified_by         Ref:User    Admin who verified
```

---

## CHAPTER 7 — MODULE DESCRIPTION

### 7.1 Public Module (No Login Required)

**Landing Page (index.html)**
- Full-screen automatic background image slider (6 images, 3-second interval)
- Sticky transparent navbar with glass effect on scroll
- About section with team information
- 6 program cards (Food, Education, Medical, Environment, Clothing, Shelter)
- Impact statistics with scroll-triggered counter animation
- Volunteer join section
- 3 donation tiers (₹500, ₹2000, ₹5000)
- Active campaigns with progress bars
- Photo gallery grid
- Testimonials from donors and volunteers
- Latest news section
- Contact form connected to backend API
- Footer with all links

### 7.2 Admin Module

**Features:**
- Secure login with role verification
- Dashboard with 8 live statistics (total donors, volunteers, donations, amount, pending, campaigns, tasks, messages)
- City-wise donor filtering (Bengaluru, Hyderabad, Chennai, Mumbai)
- Remove donors and volunteers
- Approve or reject pending donations
- Create, update, delete, activate/deactivate campaigns
- Generate QR codes for campaigns
- Assign tasks to volunteers with priority and due date
- View all transactions
- Read and manage contact messages
- Export reports in PDF and CSV — Donation, Campaign, Volunteer, Monthly
- Edit own profile

### 7.3 Donor Module

**Features:**
- Self-registration with city and address
- Secure JWT login
- Dashboard showing total donations and items donated
- Fill bank details (bank name, IFSC, account number)
- Donate money — 5 payment modes supported:
  - Cash
  - UPI
  - Bank Transfer
  - Cheque
  - Online (Razorpay payment gateway)
- Donate items with condition, quantity, category, pickup option
- View full transaction history with status badges
- Download branded PDF receipt for each donation
- Edit profile

### 7.4 Volunteer Module

**Features:**
- Self-registration with interests and date of birth
- Secure JWT login
- Dashboard showing all running tasks and personal tasks
- Mark tasks as completed
- Add new tasks
- Edit profile

---

## CHAPTER 8 — IMPLEMENTATION

### 8.1 Frontend Implementation

The frontend is built with **19 HTML pages** connected to the backend via a shared `api.js` utility file.

**Key frontend files:**
- `assets/js/api.js` — Shared API wrapper with token management, auth guards, redirect logic
- `assets/js/script.js` — Hero slider, AOS animations, counter animation, ripple effects, contact form
- `assets/css/style.css` — Complete custom CSS with 500+ lines

**API Connection Pattern:**
```javascript
// api.js — shared across all pages
const API_BASE = 'http://localhost:5000/api';

async function api(method, endpoint, body = null) {
    const headers = { 'Authorization': `Bearer ${getToken()}` };
    const res = await fetch(`${API_BASE}${endpoint}`, { method, headers, body });
    return res.json();
}
```

### 8.2 Backend Implementation

**Middleware stack in app.js:**
1. Helmet — Security headers
2. CORS — Cross-origin requests
3. Rate Limiting — Brute force protection
4. Body Parser — JSON and URL-encoded
5. Cookie Parser — Cookie handling
6. Morgan — Request logging
7. Static Files — Upload serving

**Route protection:**
```javascript
// protect — verifies JWT token
// authorize — checks user role
router.get('/dashboard', protect, authorize('admin'), ctrl.getDashboard);
```

### 8.3 Payment Integration

Razorpay integration follows a 3-step process:
1. Backend creates order via Razorpay API
2. Frontend opens Razorpay payment popup
3. Backend verifies HMAC-SHA256 signature to confirm payment

### 8.4 PDF Generation

PDFKit generates branded receipts with:
- NGO logo header in dark background
- Gold accent color (brand color #D4AF37)
- Receipt number, donor info, amount, payment mode
- Campaign name and verification status
- Footer with contact information

---

## CHAPTER 9 — API DOCUMENTATION

The complete API is documented using **Swagger UI** available at:
`http://localhost:5000/api/docs`

A **Postman Collection** is also included at:
`backend/docs/postman_collection.json`

### Key API Endpoints Summary

```
POST  /api/auth/login              — Login all roles
POST  /api/auth/register/donor     — Register donor
POST  /api/auth/register/volunteer — Register volunteer
GET   /api/admin/dashboard         — Admin statistics
GET   /api/campaigns               — All campaigns
POST  /api/donations               — Create donation
POST  /api/donations/razorpay/order — Razorpay order
POST  /api/donations/razorpay/verify — Verify payment
GET   /api/donations/:id/receipt   — PDF receipt
GET   /api/reports/donations       — Donation report
```

Total: **40+ REST API endpoints**

---

## CHAPTER 10 — SECURITY FEATURES

| Feature | Technology | Description |
|---|---|---|
| Password Hashing | bcryptjs (12 rounds) | Passwords never stored in plain text |
| Authentication | JWT (7 day expiry) | Stateless token-based auth |
| Authorization | Custom middleware | Role-based route protection |
| Input Validation | express-validator | All inputs sanitized and validated |
| Rate Limiting | express-rate-limit | 20 req/15min on auth routes |
| HTTP Security | Helmet | 11 security headers set |
| CORS | cors package | Only allowed origins accepted |
| File Upload | Multer | Type check (jpg/png/pdf), 5MB limit |
| Error Handling | Central middleware | No sensitive data in error responses |

---

## CHAPTER 11 — TESTING

### 11.1 API Testing
All API endpoints were tested using **Postman** with the included collection covering:
- Authentication flow (register → login → logout)
- Protected route access with and without token
- Role-based access (admin/donor/volunteer)
- Donation creation and Razorpay verification
- Report generation (PDF + CSV)

### 11.2 Frontend Testing
- Form validation tested for all required fields
- Login redirect tested for all 3 roles
- Dashboard data loading verified
- Responsive design tested on mobile viewport

### 11.3 Security Testing
- Unauthorized access to protected routes returns 401
- Wrong role access returns 403
- Invalid token returns 401
- Rate limiting triggers after 20 requests

---

## CHAPTER 12 — CHALLENGES FACED

| Challenge | Solution |
|---|---|
| Razorpay signature verification | Used crypto HMAC-SHA256 as per Razorpay docs |
| JWT token expiry handling | Added redirect to login on 401 response |
| PDF styling with PDFKit | Manual coordinate-based layout |
| CORS issues between ports | Configured allowed origins in backend |
| MongoDB nested population | Used Mongoose populate with select |
| File upload unique naming | UUID v4 for filenames |

---

## CHAPTER 13 — LEARNING OUTCOMES

Through this internship project, I gained practical experience in:

**Technical Skills:**
- Full-stack web development (HTML/CSS/JS + Node.js + MongoDB)
- REST API design and implementation
- JWT-based authentication and role-based authorization
- Payment gateway integration (Razorpay)
- PDF generation programmatically
- Database design with NoSQL (MongoDB + Mongoose)
- API documentation with Swagger
- File upload handling with Multer
- Security best practices (Helmet, bcrypt, rate limiting)

**Soft Skills:**
- Project planning and time management
- Technical documentation writing
- Problem solving under constraints
- Clean code practices

---

## CHAPTER 14 — CONCLUSION

The **Manara-Nexus NGO Management System** was successfully designed, developed, and tested during this internship. The project demonstrates a complete full-stack web application with:

- **19 frontend pages** with a professional modern UI
- **40+ REST API endpoints** following MVC architecture
- **Real payment gateway** integration with Razorpay
- **Automated PDF receipts** for every donation
- **Role-based access control** for 3 user types
- **Report generation** in PDF and CSV formats
- **Industry-standard security** implementation

The project is production-ready and can be deployed on cloud platforms (Vercel for frontend, Render for backend, MongoDB Atlas for database) at no cost.

This internship provided invaluable hands-on experience in building real-world software products and following professional development practices.

---

## CHAPTER 15 — REFERENCES

1. Node.js Documentation — https://nodejs.org/docs
2. Express.js Guide — https://expressjs.com/guide
3. MongoDB Documentation — https://www.mongodb.com/docs
4. Mongoose ODM — https://mongoosejs.com/docs
5. Razorpay Payment Integration — https://razorpay.com/docs
6. JWT Standard — https://jwt.io/introduction
7. PDFKit Documentation — https://pdfkit.org
8. Bootstrap 4 — https://getbootstrap.com/docs/4.6
9. Font Awesome — https://fontawesome.com
10. Swagger OpenAPI — https://swagger.io/docs

---

## APPENDIX A — PROJECT SETUP

### Prerequisites
- Node.js v18+
- MongoDB v6+
- Python 3 (for frontend server)

### Installation Steps
```bash
# 1. Backend setup
cd backend
npm install
copy .env.example .env
# Fill .env with your values

# 2. Seed database
npm run seed

# 3. Start backend
npm run dev

# 4. Start frontend (new terminal)
cd frontend
python -m http.server 3000
```

### Access URLs
| Service | URL |
|---|---|
| Website | http://localhost:3000/index.html |
| API | http://localhost:5000/api |
| API Docs | http://localhost:5000/api/docs |

### Test Credentials
| Role | Email | Password |
|---|---|---|
| Admin | admin@manara-nexus.org | Admin@123 |
| Donor | ravi@example.com | Donor@123 |
| Volunteer | neha@example.com | Vol@12345 |

---

## APPENDIX B — PROJECT STATISTICS

| Metric | Count |
|---|---|
| Total HTML Pages | 19 |
| API Endpoints | 40+ |
| Database Collections | 11 |
| Backend Files | 35+ |
| Lines of Code (approx) | 5000+ |
| npm Packages Used | 18 |

---

*Report prepared for academic internship submission*  
*Manara-Nexus © 2026*
