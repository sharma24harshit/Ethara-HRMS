# ETHARA HRMS

<div align="center">

**Human Resource Management System**

A full-stack MERN application for managing employees and tracking attendance — built with a monthly summary attendance model for fast queries and all-time stats.

![Node.js](https://img.shields.io/badge/Node.js-18+-339933?style=flat-square&logo=node.js&logoColor=white)
![React](https://img.shields.io/badge/React-18-61DAFB?style=flat-square&logo=react&logoColor=black)
![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-47A248?style=flat-square&logo=mongodb&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3-06B6D4?style=flat-square&logo=tailwindcss&logoColor=white)
![Express](https://img.shields.io/badge/Express-4-000000?style=flat-square&logo=express&logoColor=white)

</div>

---

## Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Prerequisites](#prerequisites)
- [Getting Started](#getting-started)
- [Environment Variables](#environment-variables)
- [API Reference](#api-reference)
- [Data Models](#data-models)
- [Deployment](#deployment)

---

## Features

- **Employee Management** — Add, list, and delete employees with a validated form (department dropdown, email validation, duplicate prevention)
- **Flexible Attendance Marking** — Mark Present / Absent for any employee on any past date using the built-in date picker; future dates are blocked
- **Monthly Summary Schema** — Attendance is stored as one document per employee per month with pre-computed counters (`presentCount`, `absentCount`, `totalMarked`) for O(1) summary reads
- **All-Time Summary Column** — Each employee row shows total ✓ Present / ✗ Absent / total marked days aggregated across all months
- **Attendance History Modal** — Per-employee history with three filter controls: Exact Date, Month, and Status (server-side month filter + client-side date/status filter)
- **Live Stats Bar** — Dashboard header shows Today's Present / Absent / Not Marked counts, always reflecting the current day
- **Dark Editorial UI** — Syne + DM Sans typography, fully built with Tailwind CSS utility classes and a custom design token config

---

## Tech Stack

| Layer      | Technology               |
|------------|--------------------------|
| Frontend   | React                    |  
| Styling    | Tailwind CSS             |
| HTTP Client| Axios                    | 
| Backend    | Node.js + Express        |
| Database   | MongoDB (Mongoose ODM)   |
| Dev Server | Nodemon                  |

---

## Project Structure

```
ETHARA-HRMS/
│
├── backend/
│   ├── db.js                      # Mongoose connection
│   ├── controllers/
│   │   ├── employeeController.js  # CRUD + validation logic
│   │   └── attendanceController.js# Mark, query, aggregate
│   ├── middleware/
│   │   └── errorMiddleware.js     # Central error handler
│   ├── models/
│   │   ├── Employee.js            # Employee schema
│   │   └── Attendance.js          # Monthly summary schema
│   ├── routes/
│   │   ├── employeeRoutes.js
│   │   └── attendanceRoutes.js
│   ├── app.js                     # Express setup + middleware
│   ├── server.js                  # Entry point
│   ├── .env                       # Environment variables
│   └── package.json
│
└── frontend/
    ├── public/
    │   └── index.html
    ├── src/
    │   ├── components/
    │   │   ├── EmployeeForm.js    # Add employee form (renders inside modal)
    │   │   ├── EmployeeList.js    # Table with date picker + attendance actions
    │   │   ├── AttendanceHistory.js # History modal with filters
    │   │   └── Loader.js          # Reusable spinner
    │   ├── pages/
    │   │   └── Dashboard.js       # Root page — stats bar + modals
    │   ├── services/
    │   │   └── api.js             # Axios instance + all API functions
    │   ├── utils/
    │   │   └── getTodayDate.js    # Returns YYYY-MM-DD for today
    │   ├── App.js
    │   ├── App.css                # Tailwind directives + 3 global rules
    │   └── index.js
    ├── tailwind.config.js         # Design tokens (colors, fonts, animations)
    ├── postcss.config.js
    ├── .env
    └── package.json
```

---

## Prerequisites

Make sure the following are installed on your machine before proceeding:

| Tool       | Minimum Version | Check Command       |
|------------|-----------------|---------------------|
| Node.js    | 16.x            | `node -v`           |
| npm        | 8.x             | `npm -v`            |
| MongoDB    | 5.x (local) or MongoDB Atlas account | — |

---

## Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/your-username/ethara-hrms.git
cd ETHARA-HRMS
```

### 2. Set up the Backend

```bash
cd backend
npm install
```

Create the environment file:

```bash
cp .env.example .env
# Then edit .env and set your MONGO_URI (see Environment Variables below)
```

Start the backend server:

```bash
# Development (auto-restarts on file change)
npm run dev

# Production
npm start
```

The API will be running at: **`http://localhost:5000`**

---

### 3. Set up the Frontend

Open a **new terminal tab**, then:

```bash
cd frontend
npm install
```

Create the environment file:

```bash
cp .env.example .env
# REACT_APP_API_URL should point to your backend URL
```

Start the React development server:

```bash
npm start
```

The app will open at: **`http://localhost:3000`**

---

### 4. Build for Production

```bash
cd frontend
npm run build
```

This generates an optimized production bundle in `frontend/build/`.

---

## Environment Variables

### `backend/.env`

```env
# Port the Express server listens on
PORT=5000

# MongoDB connection string
# Local:   mongodb://localhost:27017/ethara-hrms
# Atlas:   mongodb+srv://<user>:<password>@cluster.mongodb.net/ethara-hrms
MONGO_URI=mongodb://localhost:27017/ethara-hrms
```

### `frontend/.env`

```env
# Base URL of the backend API
# Local development:
VITE_API_URL=http://localhost:5000

# After deploying backend (e.g. Render):
# VITE_API_URL=https://your-backend.onrender.com
```

> **Note:** React environment variables must be prefixed with `REACT_APP_` to be accessible in the browser bundle. Changes to `.env` require restarting the dev server.

---

## API Reference

### Base URL
`http://localhost:5000/api`

---

### Employees

| Method | Endpoint                     | Description                        |
|--------|------------------------------|------------------------------------|
| `GET`  | `/employees`                 | Get all employees                  |
| `POST` | `/employees`                 | Create a new employee              |
| `DELETE` | `/employees/:employeeId`   | Delete employee by ID              |

**POST `/employees` — Request Body**
```json
{
  "employeeId": "EMP-001",
  "fullName":   "Jane Smith",
  "email":      "jane@company.com",
  "department": "Engineering"
}
```

---

### Attendance

| Method | Endpoint                             | Description                                      |
|--------|--------------------------------------|--------------------------------------------------|
| `POST` | `/attendance`                        | Mark or update attendance for a date             |
| `GET`  | `/attendance?date=YYYY-MM-DD`        | Get all attendance records for a specific date   |
| `GET`  | `/attendance/:employeeId`            | Get full history for one employee                |
| `GET`  | `/attendance/:employeeId?month=YYYY-MM` | Filter history to a specific month            |
| `GET`  | `/attendance/:employeeId?date=YYYY-MM-DD` | Filter history to an exact date             |
| `GET`  | `/attendance/:employeeId?status=Present` | Filter history by status                    |
| `GET`  | `/attendance/summary`                | All-time present/absent/total counts per employee|

**POST `/attendance` — Request Body**
```json
{
  "employeeId": "EMP-001",
  "date":       "2025-02-14",
  "status":     "Present"
}
```

> Marking an already-marked date updates the existing record (Present → Absent or vice versa).

---

## Data Models

### Employee
```js
{
  employeeId: String,   // unique, required
  fullName:   String,   // required
  email:      String,   // unique, required, email format validated
  department: String,   // required
  createdAt:  Date,
  updatedAt:  Date
}
```

### Attendance (Monthly Summary)
```js
{
  employeeId:   String,    // required, indexed
  month:        String,    // "YYYY-MM" — one doc per employee per month
  days: {
    "01": "Present",       // zero-padded day key → status value
    "15": "Absent",
    // ...
  },
  presentCount: Number,    // maintained in sync on every write
  absentCount:  Number,
  totalMarked:  Number,
  createdAt:    Date,
  updatedAt:    Date
}
// Unique index: { employeeId, month }
```

---

## Deployment

### Backend — [Render](https://render.com)

Render is the recommended platform for the Express + MongoDB backend.

1. Push your code to a GitHub repository
2. Go to [render.com](https://render.com) → **New → Web Service**
3. Connect your GitHub repo and select the `backend/` root directory
4. Configure the service:

   | Setting        | Value              |
   |----------------|--------------------|
   | **Runtime**    | Node                |
   | **Build Command** | `npm install`   |
   | **Start Command** | `npm start`     |
   | **Branch**     | `main`              |

5. Add Environment Variables in the Render dashboard:

   ```
   PORT        = 10000         (Render sets PORT automatically, but set it as backup)
   MONGO_URI   = mongodb+srv://...  (your Atlas connection string)
   NODE_ENV    = production
   ```

6. Click **Deploy** — Render will give you a URL like `https://ethara-hrms-api.onrender.com`
7. Update `frontend/.env` → `REACT_APP_API_URL=https://ethara-hrms-api.onrender.com`

> **Free tier note:** Render's free tier spins down after 15 minutes of inactivity. The first request after sleep may take ~30 seconds. Upgrade to a paid instance for always-on availability.

---

### Frontend — [Vercel](https://vercel.com)

Vercel is the recommended platform for the React frontend.

1. Go to [vercel.com](https://vercel.com) → **New Project**
2. Import your GitHub repository
3. Set the **Root Directory** to `frontend`
4. Vercel auto-detects Create React App — build settings are pre-filled:

   | Setting           | Value            |
   |-------------------|------------------|
   | **Framework**     | Create React App |
   | **Build Command** | `npm run build`  |
   | **Output Dir**    | `build`          |

5. Add Environment Variables in the Vercel dashboard:

   ```
   REACT_APP_API_URL = https://ethara-hrms-api.onrender.com
   ```

6. Click **Deploy** — Vercel will give you a URL like `https://ethara-hrms.vercel.app`

> **Important:** Every time you redeploy the backend (new Render URL), update `REACT_APP_API_URL` in Vercel and trigger a redeploy so the frontend bundle picks up the new URL.

---

### Database — [MongoDB Atlas](https://cloud.mongodb.com)

1. Create a free account at [cloud.mongodb.com](https://cloud.mongodb.com)
2. Create a new **Cluster** (M0 Free Tier is sufficient)
3. Under **Database Access** → Add a user with read/write permissions
4. Under **Network Access** → Add IP `0.0.0.0/0` (allow all) for hosted deployments
5. Click **Connect → Drivers** and copy the connection string:
   ```
   mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/ethara-hrms?retryWrites=true&w=majority
   ```
6. Paste this as `MONGO_URI` in both your local `backend/.env` and Render's environment variables

---

## Local Development Summary

```
Terminal 1 (Backend)          Terminal 2 (Frontend)
─────────────────────         ──────────────────────
cd backend                    cd frontend
npm install                   npm install
npm run dev                   npm start
→ localhost:5000               → localhost:3000
```

---

<div align="center">
  Built with the MERN stack · Styled with Tailwind CSS · Deployed on Vercel + Render + MongoDB Atlas
</div>