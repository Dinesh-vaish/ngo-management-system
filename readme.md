# Manara-Nexus — NGO Management System
### Frontend Report
## Project Overview

**Manara-Nexus** is a web-based NGO Management System that connects **Donors**, **Volunteers**, and **Administrators** on a single platform to manage donations, tasks, and community impact across 4 cities in India.

> This repository contains the complete **Frontend** of the project.  
## What We Did

### 1. Original Project (PHP Based)
The project was originally built in **PHP + MySQL** with Bootstrap 4.
- All pages were `.php` files mixed with HTML
- Database connection via PDO
- Session-based authentication
- No separation of frontend and backend

### 2. Frontend Separation
We extracted and rebuilt the entire frontend into **pure HTML + CSS + JavaScript** — completely independent of any backend.

- Removed all PHP logic from pages
- Replaced dynamic PHP data with `// TODO: API` comments for backend developer
- All 36 PHP files deleted
- Clean folder structure created under `frontend/`

### 3. Renaming
Project renamed from **"NGO Management System"** → **"Manara-Nexus"**  
Updated across all 19 HTML files.

---

## Tech Stack

| Layer | Technology |
|---|---|
| Markup | HTML5 (Semantic) |
| Styling | CSS3 + Bootstrap 4 |
| Icons | Font Awesome 6.5 (CDN) |
| Fonts | Google Fonts — Inter |
| Scripting | Vanilla JavaScript (ES6) |
| Dev Server | Python `http.server` (port 5500) |

---

## Folder Structure

```
NGO-Management-System/
│
├── frontend/                        ← All frontend files
│   ├── index.html                   ← Main landing page
│   │
│   ├── assets/
│   │   ├── css/
│   │   │   └── style.css            ← Custom CSS (full design)
│   │   └── js/
│   │       └── script.js            ← Slider, AOS, Ripple, Counter JS
│   │
│   ├── login/
│   │   ├── adminLogin.html
│   │   ├── donorLogin.html
│   │   └── volunteerLogin.html
│   │
│   ├── signup/
│   │   ├── adminSignup.html
│   │   ├── donorSignup.html
│   │   └── volunteerSignup.html
│   │
│   ├── dashboard/
│   │   ├── adminDashboard.html      ← City-wise donor tables
│   │   ├── adminVolunteers.html     ← Volunteers list
│   │   ├── donorDashboard.html      ← Donation summary + items
│   │   └── volunteerDashboard.html  ← Tasks view
│   │
│   ├── donor/
│   │   ├── details.html             ← Bank details form
│   │   ├── donateMoney.html         ← Donate amount form
│   │   ├── donateItems.html         ← Donate items form
│   │   └── transactions.html        ← Transaction history
│   │
│   ├── volunteer/
│   │   └── tasks.html               ← Add task form
│   │
│   └── update/
│       ├── adminUpdate.html
│       ├── donorUpdate.html
│       └── volunteerUpdate.html
│
├── bootstrap/                       ← Bootstrap 4 CSS + JS assets
│   ├── css/
│   │   ├── bootstrap.min.css
│   │   └── style.css
│   └── js/
│       ├── bootstrap.min.js
│       ├── jquery.min.js
│       └── popper.min.js
│
├── images/                          ← Project images
│   ├── admin.png
│   ├── donors.png
│   ├── volunteer.png
│   └── index/
│       └── logo.png, carousel images
│
├── sql/
│   └── ngo.sql                      ← Database schema (for backend)
│
└── README.md                        ← This file
```

---

## Pages Built (Total: 19 HTML Pages)

| Page | Path | Description |
|---|---|---|
| Home | `index.html` | Full landing page with all sections |
| Admin Login | `login/adminLogin.html` | Admin login form |
| Donor Login | `login/donorLogin.html` | Donor login form |
| Volunteer Login | `login/volunteerLogin.html` | Volunteer login form |
| Admin Signup | `signup/adminSignup.html` | Admin registration |
| Donor Signup | `signup/donorSignup.html` | Donor registration |
| Volunteer Signup | `signup/volunteerSignup.html` | Volunteer registration |
| Admin Dashboard | `dashboard/adminDashboard.html` | City-wise donor management |
| Admin Volunteers | `dashboard/adminVolunteers.html` | Volunteer management |
| Donor Dashboard | `dashboard/donorDashboard.html` | Donations + items view |
| Volunteer Dashboard | `dashboard/volunteerDashboard.html` | Tasks view |
| Bank Details | `donor/details.html` | Donor bank details form |
| Donate Money | `donor/donateMoney.html` | Money donation form |
| Donate Items | `donor/donateItems.html` | Item donation form |
| Transactions | `donor/transactions.html` | Transaction history table |
| Add Task | `volunteer/tasks.html` | Volunteer task form |
| Admin Update | `update/adminUpdate.html` | Admin profile edit |
| Donor Update | `update/donorUpdate.html` | Donor profile edit |
| Volunteer Update | `update/volunteerUpdate.html` | Volunteer profile edit |

---

## Landing Page (index.html) Sections

| # | Section | Features |
|---|---|---|
| 1 | Navbar | Transparent → dark glass on scroll, FA icons, Sign In + Donate button |
| 2 | Hero | Full screen (100vh), 6-image auto slider, 3s fade transition, indicators |
| 3 | About | Two-column layout, image + content, years badge |
| 4 | Programs | 6 program cards, FA icons, hover lift effect |
| 5 | Impact Stats | Gold background, counter animation on scroll |
| 6 | Volunteer | Steps layout, image, join button |
| 7 | Donation | 3 tier cards (₹500 / ₹2000 / ₹5000), featured badge |
| 8 | Campaigns | 3 cards with progress bars and amounts |
| 9 | Gallery | CSS Grid, 2-row layout, hover overlay |
| 10 | Testimonials | 3 cards with star ratings and avatars |
| 11 | Latest News | 3 news cards with images |
| 12 | Contact | Form + contact info with FA icons |
| 13 | Footer | 4-column grid, social FA icons, links |

---

## User Roles

### Admin
- View donors city-wise (Bengaluru, Hyderabad, Chennai, Mumbai)
- See total donations
- Remove donors
- Manage volunteers

### Donor
- Register and login
- Fill bank details
- Donate money (track total)
- Donate items
- View transaction history
- Edit profile

### Volunteer
- Register and login
- View all running tasks
- Add new tasks
- Edit profile

---

## Colors Used

| Name | Hex |
|---|---|
| Background | `#0F172A` |
| Gold (Primary) | `#D4AF37` |
| White | `#FFFFFF` |
| Gray | `#CBD5E1` |
| Dark Secondary | `#1E293B` |
| Section Dark | `#111827` |

---

## JavaScript Features

| Feature | Description |
|---|---|
| Hero Slider | 6 images, auto-play every 3s, smooth fade, indicator click |
| Navbar Scroll | Transparent → dark glass blur after 60px scroll |
| AOS Animations | Scroll-triggered fade-up / fade-left / fade-right |
| Counter Animation | Numbers count up when Impact section enters viewport |
| Button Ripple | Click ripple effect on all CTA buttons |
| Contact Form | Submit feedback with success state |
| Smooth Scroll | All anchor links scroll smoothly |

---

## How to Run

```bash
# Python (recommended)
cd frontend
python -m http.server 5500

# Then open in browser:
http://localhost:5500/index.html
```

---

## Backend Integration Notes

Backend developer ko yeh API endpoints banana hain:

| Method | Endpoint | Use |
|---|---|---|
| POST | `/api/admin/login` | Admin login |
| POST | `/api/donor/login` | Donor login |
| POST | `/api/volunteer/login` | Volunteer login |
| POST | `/api/admin/signup` | Admin register |
| POST | `/api/donor/signup` | Donor register |
| POST | `/api/volunteer/signup` | Volunteer register |
| GET | `/api/admin/donors?city_id=1` | City-wise donors |
| GET | `/api/admin/totalDonations` | Total donations |
| DELETE | `/api/admin/donor/:id` | Remove donor |
| GET | `/api/donor/account` | Donor account info |
| POST | `/api/donor/donateMoney` | Add donation |
| GET | `/api/donor/transactions` | Transaction history |
| POST | `/api/donor/donateItems` | Donate item |
| GET | `/api/donor/items` | Donor items list |
| GET | `/api/tasks/all` | All tasks |
| GET | `/api/volunteer/tasks` | My tasks |
| POST | `/api/volunteer/tasks` | Add task |
| GET | `/api/*/profile` | Get profile |
| PUT | `/api/*/profile` | Update profile |
| POST | `/api/logout` | Logout |

Database schema is available in `sql/ngo.sql`

---

## Team

| Role | Work Done |
|---|---|
| Frontend Developer | HTML, CSS, JS — all 19 pages + landing page |
| Backend Developer | PHP + MySQL API (in progress) |

---

*Manara-Nexus © 2026. Built with purpose.*
