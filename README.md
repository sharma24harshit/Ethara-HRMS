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
git clone https://github.com/sharma24harshit/Ethara-HRMS/tree/main
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

# Production
npm start
```
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
# VITE_API_URL should point to your backend URL
```

Start the React development server:

```bash
npm run dev
```

The app will open at: **`http://localhost:5173`**

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
# Atlas:   mongodb+srv://<user>:<password>@cluster.mongodb.net/ethara-hrms
MONGO_URI=mongodb://localhost:27017/ethara-hrms
```

### `frontend/.env`

```env
# Base URL of the backend API
# Local development:
VITE_API_URL=http://localhost:5173

# After deploying backend (e.g. Render):
# VITE_API_URL=https://your-backend.onrender.com
```
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

## Deployment

### Backend — [Render](https://render.com)

### Frontend — [Vercel](https://vercel.com)


<div align="center">
  Built with the MERN stack · Styled with Tailwind CSS · Deployed on Vercel + Render + MongoDB Atlas
</div>