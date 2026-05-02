<div align="center">



# 🍽️ RASTURA — Where Taste Meets Elegance

**A full-stack Indian fine-dining restaurant web application built with the MERN stack.**

[![Live Site](https://img.shields.io/badge/🌐_Live_Site-rastura--restaurant.netlify.app-EF7C5D?style=for-the-badge)](https://rastura-restaurant.netlify.app)
[![Backend API](https://img.shields.io/badge/⚙️_Backend_API-Render-46E3B7?style=for-the-badge)](https://rastura-restaurant.onrender.com)
[![GitHub](https://img.shields.io/badge/GitHub-sitikanthsahoo-181717?style=for-the-badge&logo=github)](https://github.com/sitikanthsahoo/rastura-restaurant)

![React](https://img.shields.io/badge/React-20232A?style=flat&logo=react&logoColor=61DAFB)
![Vite](https://img.shields.io/badge/Vite-B73BFE?style=flat&logo=vite&logoColor=FFD62E)
![TailwindCSS](https://img.shields.io/badge/TailwindCSS-38B2AC?style=flat&logo=tailwind-css&logoColor=white)
![Node.js](https://img.shields.io/badge/Node.js-339933?style=flat&logo=node.js&logoColor=white)
![Express](https://img.shields.io/badge/Express-000000?style=flat&logo=express&logoColor=white)
![MongoDB](https://img.shields.io/badge/MongoDB-47A248?style=flat&logo=mongodb&logoColor=white)
![JWT](https://img.shields.io/badge/JWT-000000?style=flat&logo=jsonwebtokens&logoColor=white)

</div>

---

## 📸 Screenshots

### 🏠 Homepage — Hero Section
![Homepage](./docs/screenshots/homepage.png)

### 🍽️ Menu Section — Veg/Non-Veg Filter & Spice Levels
![Menu](./docs/screenshots/menu.png)

### 📊 Admin Dashboard — Analytics Overview
![Admin Dashboard](./docs/screenshots/admin.png)

---

## ✨ Features

### 🌐 Customer-Facing
- **Dynamic Indian Menu** — Authentic dishes across Starters, Mains, Desserts & Drinks
- **Veg / Non-Veg Filter** — Toggle with Indian-style color-coded square dot indicators
- **Spice Level Indicators** — 🔥 Flame icons for Mild / Medium / Hot dishes
- **Add to Cart System** — `+` button with quantity badge & floating order bar
- **Online Reservations** — Full booking form with real-time backend integration
- **Customer Reviews** — Star rating submission form with auto-advancing carousel
- **Events Section** — Special dining events & experiences
- **Dark / Light Mode** — Smooth theme toggle with persistence
- **Google Maps** — Live Bengaluru MG Road location embed in footer
- **WhatsApp Booking** — Pre-filled WhatsApp chat for instant reservations
- **Custom Cursor** — Branded interactive cursor experience

### 🔐 Admin Panel (`/admin`)
- **Secure JWT Authentication** — Login with hashed credentials stored in MongoDB
- **Analytics Dashboard** — Reservation stats, donut chart (Confirmed/Pending/Cancelled), menu breakdown with animated bar charts, recent bookings
- **Reservation Management** — Confirm, cancel, or delete bookings in real-time
- **Menu Manager** — Add new dishes with image, price, category, Veg/Non-Veg flag
- **Events Manager** — Add and delete restaurant events

---

## 🗂️ Project Structure

```
rastura-restaurant/
│
├── 📁 public/
│   └── _redirects              # Netlify SPA routing fix
│
├── 📁 server/                  # Express.js Backend
│   ├── index.js                # Main server entry + all API routes
│   ├── seed.js                 # Admin user seed script
│   ├── package.json
│   └── .env.example            # Environment variable template
│
├── 📁 src/                     # React Frontend (Vite)
│   ├── 📁 components/
│   │   ├── Navbar.jsx          # Sticky nav with dark mode toggle
│   │   ├── Hero.jsx            # Animated landing section
│   │   ├── About.jsx           # Restaurant story section
│   │   ├── Menu.jsx            # Menu with filters & cart integration
│   │   ├── Cart.jsx            # Floating cart bar component
│   │   ├── Events.jsx          # Events & dining experiences
│   │   ├── Gallery.jsx         # Image gallery section
│   │   ├── Testimonials.jsx    # Reviews carousel + submission form
│   │   ├── Reservations.jsx    # Table booking form
│   │   ├── Footer.jsx          # Google Maps, WhatsApp, FSSAI
│   │   ├── AdminLogin.jsx      # JWT-protected login page
│   │   ├── AdminDashboard.jsx  # Full admin panel with analytics
│   │   ├── CustomCursor.jsx    # Branded custom mouse cursor
│   │   └── FadeUp.jsx          # Reusable scroll animation wrapper
│   │
│   ├── 📁 data/
│   │   └── menuData.js         # Static Indian menu fallback data
│   │
│   ├── App.jsx                 # Root component + routing + cart state
│   ├── main.jsx                # React entry point
│   └── index.css               # Global styles + Tailwind + custom tokens
│
├── .env.example                # Frontend env template
├── .gitignore                  # Hides .env files, node_modules, dist
├── index.html                  # HTML entry point
├── vite.config.js              # Vite configuration
├── tailwind.config.js          # Tailwind + custom fonts/colors
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
cp .env.example .env
# Fill in your values in .env
node index.js
```

### 3. Setup the Frontend
```bash
# From project root
npm install
cp .env.example .env
# Set VITE_API_URL=http://localhost:5000
npm run dev
```

---

## 🔑 Environment Variables

### Frontend (`.env`)
| Variable | Description | Example |
|---|---|---|
| `VITE_API_URL` | Your backend URL | `https://rastura-restaurant.onrender.com` |

### Backend (`server/.env`)
| Variable | Description | Example |
|---|---|---|
| `PORT` | Server port | `5000` |
| `MONGODB_URI` | MongoDB Atlas connection string | `mongodb+srv://user:pass@cluster.net/rastura` |
| `JWT_SECRET` | Secret key for JWT signing | `any_long_random_string` |

---

## 📡 API Endpoints

### Auth
| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/api/auth/login` | Admin login — returns JWT token |

### Menu
| Method | Endpoint | Description | Auth |
|---|---|---|---|
| `GET` | `/api/menu` | Get all menu items | 🔓 Public |
| `POST` | `/api/menu` | Add a new dish | ✅ JWT |
| `DELETE` | `/api/menu/:id` | Delete a dish | ✅ JWT |

### Reservations
| Method | Endpoint | Description | Auth |
|---|---|---|---|
| `POST` | `/api/reservations` | Submit a booking | 🔓 Public |
| `GET` | `/api/reservations` | Get all bookings | ✅ JWT |
| `PATCH` | `/api/reservations/:id` | Update booking status | ✅ JWT |
| `DELETE` | `/api/reservations/:id` | Delete a booking | ✅ JWT |

### Events
| Method | Endpoint | Description | Auth |
|---|---|---|---|
| `GET` | `/api/events` | Get all events | 🔓 Public |
| `POST` | `/api/events` | Create an event | ✅ JWT |
| `DELETE` | `/api/events/:id` | Delete an event | ✅ JWT |

---

## ☁️ Deployment

| Service | Purpose | Config |
|---|---|---|
| **Netlify** | Frontend hosting | Build: `npm run build`, Publish: `dist`, Env: `VITE_API_URL` |
| **Render** | Backend API hosting | Root: `server/`, Build: `npm install`, Start: `node index.js` |
| **MongoDB Atlas** | Cloud database | Free M0 cluster, IP whitelist: `0.0.0.0/0` |

### Continuous Deployment
Every `git push` to `main` automatically redeploys both Netlify (frontend) and Render (backend). No manual steps needed.

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| **Frontend** | React 18, Vite, Tailwind CSS, Framer Motion |
| **Icons** | Lucide React |
| **Routing** | React Router v6 |
| **Backend** | Node.js, Express.js |
| **Database** | MongoDB Atlas, Mongoose |
| **Auth** | JWT (jsonwebtoken), bcryptjs |
| **Hosting** | Netlify (frontend), Render (backend) |

---

## 👨‍💻 Admin Access

```
URL:       https://rastura-restaurant.netlify.app/admin
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
