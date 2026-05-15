<div align="center">

# 🍽️ RASTURA — Where Taste Meets Elegance

**A full-stack Indian fine-dining restaurant web application built with the MERN stack.**

[![Live Site](https://img.shields.io/badge/🌐_Live_Site-rastura--restaurant.onrender.com-EF7C5D?style=for-the-badge)](https://rastura-restaurant.onrender.com)
[![Backend API](https://img.shields.io/badge/⚙️_Backend_API-Render-46E3B7?style=for-the-badge)](https://rastura-restaurant.onrender.com)
[![GitHub](https://img.shields.io/badge/GitHub-sitikanthsahoo-181717?style=for-the-badge&logo=github)](https://github.com/sitikanthsahoo/rastura-restaurant)

![React](https://img.shields.io/badge/React-20232A?style=flat&logo=react&logoColor=61DAFB)
![Vite](https://img.shields.io/badge/Vite-B73BFE?style=flat&logo=vite&logoColor=FFD62E)
![Node.js](https://img.shields.io/badge/Node.js-339933?style=flat&logo=node.js&logoColor=white)
![Express](https://img.shields.io/badge/Express-000000?style=flat&logo=express&logoColor=white)
![MongoDB](https://img.shields.io/badge/MongoDB-47A248?style=flat&logo=mongodb&logoColor=white)
![JWT](https://img.shields.io/badge/JWT-000000?style=flat&logo=jsonwebtokens&logoColor=white)
![Razorpay](https://img.shields.io/badge/Razorpay-0D2366?style=flat&logo=razorpay&logoColor=white)

</div>

---

## 📸 Screenshots

### 🏠 Homepage — Hero Section
![Homepage](./docs/screenshots/homepage.png)

### 🍽️ Menu Section — Veg/Non-Veg Filter & Star Ratings
![Menu](./docs/screenshots/menu.png)

### 🔐 Admin Portal — Secure Login
![Admin Portal](./docs/screenshots/admin.png)

---

## ✨ Features

### 🌐 Customer-Facing
- **Dynamic Indian Menu** — Authentic dishes across Starters, Mains, Desserts & Drinks with ₹ Indian Rupee pricing
- **Veg / Non-Veg Filter** — Toggle with Indian-style color-coded square dot indicators
- **Spice Level Indicators** — 🔥 Flame icons for Mild / Medium / Hot dishes
- **Add to Cart + Razorpay Checkout** — `+` button with quantity badge, floating order bar & online payment via Razorpay
- **Online Reservations** — Full table booking form with real-time backend integration
- **⭐ Customer Reviews & Star Ratings** — Authenticated users can submit 1–5 star ratings + written reviews per dish; average ratings shown on menu cards
- **Events Section** — Special dining events & experiences
- **Dark / Light Mode** — Smooth theme toggle with localStorage persistence
- **Google Maps** — Live Bengaluru MG Road location embed in footer
- **WhatsApp Booking** — Pre-filled WhatsApp chat for instant reservations
- **Custom Cursor** — Branded interactive cursor experience

### 👤 Customer Account System
- **Registration & Login** — Secure JWT-based customer authentication
- **Customer Dashboard (`/profile`)** — Tabbed interface with Profile, Addresses & Bookings
  - **Profile Tab** — Edit full name and phone number inline
  - **Addresses Tab** — Save multiple delivery addresses (Home / Work / Other) with label, street, city & pincode; delete any address
  - **Bookings Tab** — View full reservation history with status (Pending / Confirmed / Cancelled)

### 🔐 Admin Panel (`/admin`)
- **Secure JWT Authentication** — Login with hashed credentials stored in MongoDB
- **Independent Dark / Light Mode** — Admin panel has its own theme setting, separate from the customer site
- **Analytics Dashboard** — Reservation stats, donut chart (Confirmed/Pending/Cancelled), menu breakdown with animated bar charts, recent bookings table
- **Reservation Management** — Confirm, cancel, or delete bookings in real-time
- **Menu Manager** — Add new dishes with image, price, category, Veg/Non-Veg flag & spice level
- **Events Manager** — Add and delete restaurant events

---

## 🗂️ Project Structure

```
rastura-restaurant/
│
├── 📁 public/
│   └── _redirects              # SPA routing fix for Render/Netlify
│
├── 📁 server/                  # Express.js Backend
│   ├── index.js                # Main server + all API routes + schemas
│   ├── seed.js                 # Admin user seed script
│   ├── package.json
│   └── .env                    # Secret env vars (NOT in git)
│
├── 📁 src/                     # React Frontend (Vite)
│   ├── 📁 components/
│   │   ├── Navbar.jsx          # Sticky nav with dark mode toggle + auth state
│   │   ├── Hero.jsx            # Animated landing section
│   │   ├── About.jsx           # Restaurant story section
│   │   ├── Menu.jsx            # Menu with filters, cart, star ratings & review modal
│   │   ├── Cart.jsx            # Floating cart bar + Razorpay checkout
│   │   ├── Events.jsx          # Events & dining experiences
│   │   ├── Gallery.jsx         # Image gallery section
│   │   ├── Testimonials.jsx    # Reviews carousel
│   │   ├── Reservations.jsx    # Table booking form
│   │   ├── Footer.jsx          # Google Maps, WhatsApp, FSSAI
│   │   ├── AdminLogin.jsx      # JWT-protected admin login page
│   │   ├── AdminDashboard.jsx  # Full admin panel with analytics & independent dark mode
│   │   ├── CustomerDashboard.jsx # Customer profile, addresses & bookings
│   │   ├── CustomCursor.jsx    # Branded custom mouse cursor
│   │   └── FadeUp.jsx          # Reusable scroll animation wrapper
│   │
│   ├── 📁 data/
│   │   └── menuData.js         # Static Indian menu fallback data
│   │
│   ├── App.jsx                 # Root component + routing + cart state
│   ├── main.jsx                # React entry point
│   └── index.css               # Global CSS with design tokens & dark mode
│
├── 📁 docs/screenshots/        # README screenshots
├── .env                        # Frontend env (NOT in git)
├── .env.example                # Frontend env template
├── .gitignore                  # Hides .env files, node_modules, dist
├── render.yaml                 # Render deployment config
├── index.html                  # HTML entry point
├── vite.config.js              # Vite configuration
└── package.json
```

---

## 🚀 Getting Started (Local Development)

### Prerequisites
- Node.js v18+
- npm
- MongoDB Atlas account (free tier)

### 1. Clone the repository
```bash
git clone https://github.com/sitikanthsahoo/rastura-restaurant.git
cd rastura-restaurant
```

### 2. Setup the Backend
```bash
cd server
npm install
# Create server/.env with values from .env.example
node index.js
# Should print: Connected to MongoDB ✅
```

### 3. Setup the Frontend
```bash
# From project root
npm install
# Create .env with VITE_API_URL=http://localhost:5000
npm run dev
# Open: http://localhost:5173
```

---

## 🔑 Environment Variables

### Frontend (`.env`)
| Variable | Description | Example |
|---|---|---|
| `VITE_API_URL` | Backend API URL | `https://rastura-restaurant.onrender.com` |
| `VITE_RAZORPAY_KEY_ID` | Razorpay public key | `rzp_test_xxxx` |

### Backend (`server/.env`)
| Variable | Description | Example |
|---|---|---|
| `PORT` | Server port | `5000` |
| `MONGODB_URI` | MongoDB Atlas connection string | `mongodb+srv://user:pass@cluster.net/rastura` |
| `JWT_SECRET` | Secret key for JWT signing | `any_long_random_string` |
| `RAZORPAY_KEY_ID` | Razorpay key ID | `rzp_test_xxxx` |
| `RAZORPAY_KEY_SECRET` | Razorpay secret | `your_razorpay_secret` |

---

## 📡 API Endpoints

### Customer Auth
| Method | Endpoint | Description | Auth |
|---|---|---|---|
| `POST` | `/api/users/register` | Register new customer | 🔓 Public |
| `POST` | `/api/users/login` | Customer login — returns JWT | 🔓 Public |
| `GET` | `/api/users/me` | Get logged-in user profile | 🔐 Customer JWT |
| `PATCH` | `/api/users/profile` | Update name & phone | 🔐 Customer JWT |
| `POST` | `/api/users/addresses` | Add delivery address | 🔐 Customer JWT |
| `DELETE` | `/api/users/addresses/:id` | Delete delivery address | 🔐 Customer JWT |

### Admin Auth
| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/api/auth/login` | Admin login — returns JWT |

### Menu
| Method | Endpoint | Description | Auth |
|---|---|---|---|
| `GET` | `/api/menu` | Get all menu items | 🔓 Public |
| `POST` | `/api/menu` | Add a new dish | ✅ Admin JWT |
| `DELETE` | `/api/menu/:id` | Delete a dish | ✅ Admin JWT |

### Reviews & Ratings
| Method | Endpoint | Description | Auth |
|---|---|---|---|
| `POST` | `/api/reviews` | Submit / update a review | 🔐 Customer JWT |
| `GET` | `/api/reviews/:menuItemId` | Get reviews for a dish | 🔓 Public |
| `GET` | `/api/reviews` | Get avg ratings for all items | 🔓 Public |

### Reservations
| Method | Endpoint | Description | Auth |
|---|---|---|---|
| `POST` | `/api/reservations` | Submit a booking | 🔓 Public |
| `GET` | `/api/reservations` | Get all bookings | ✅ Admin JWT |
| `PATCH` | `/api/reservations/:id` | Update booking status | ✅ Admin JWT |
| `DELETE` | `/api/reservations/:id` | Delete a booking | ✅ Admin JWT |

### Events
| Method | Endpoint | Description | Auth |
|---|---|---|---|
| `GET` | `/api/events` | Get all events | 🔓 Public |
| `POST` | `/api/events` | Create an event | ✅ Admin JWT |
| `DELETE` | `/api/events/:id` | Delete an event | ✅ Admin JWT |

### Payments
| Method | Endpoint | Description | Auth |
|---|---|---|---|
| `POST` | `/api/payment/create-order` | Create Razorpay order | 🔓 Public |
| `POST` | `/api/payment/verify` | Verify payment signature | 🔓 Public |

---

## ☁️ Deployment

| Service | Purpose | Config |
|---|---|---|
| **Render** | Frontend + Backend hosting | `render.yaml` auto-configures both services |
| **MongoDB Atlas** | Cloud database | Free M0 cluster, IP whitelist: `0.0.0.0/0` |

### Continuous Deployment
Every `git push` to `main` automatically redeploys the backend on Render. No manual steps needed.

> **Security Note:** All secrets (MongoDB URI, JWT Secret, Razorpay keys) are stored only in Render's Environment dashboard and are **never committed to git**.

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| **Frontend** | React 18, Vite, Vanilla CSS, Framer Motion |
| **Icons** | Lucide React |
| **Routing** | React Router v6 |
| **Backend** | Node.js, Express.js |
| **Database** | MongoDB Atlas, Mongoose |
| **Auth** | JWT (jsonwebtoken), bcryptjs |
| **Payments** | Razorpay |
| **Hosting** | Render (full-stack) |

---

## 👨‍💻 Admin Access

```
URL:       https://rastura-restaurant.onrender.com/admin
Username:  admin
Password:  admin123
```

> ⚠️ Change credentials after deployment for production use.

---

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

---

<div align="center">

Made with ❤️ by **Sitikanth Sahoo** | RASTURA Indian Fine Dining 🇮🇳

</div>
