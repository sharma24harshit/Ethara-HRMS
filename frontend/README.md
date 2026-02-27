Check this before submitting :

- Clean folder structure
- Proper naming
- Error handling everywhere
- No console errors
- Works smoothly
- Simple but professional UI
- Good README

**Root Structure**

ETHARA-HRMS/
│
├── backend/
├── frontend/
├── README.md

**Backend Structure (Node + Express + MongoDB)**
backend/
│
├── config/
│   └── db.js
│
├── models/
│   ├── Employee.js
│   └── Attendance.js
│
├── controllers/
│   ├── employeeController.js
│   └── attendanceController.js
│
├── routes/
│   ├── employeeRoutes.js
│   └── attendanceRoutes.js
│
├── middleware/
│   └── errorMiddleware.js
│
├── .env
├── app.js
├── server.js
└── package.json

**Backend File Responsibilities**
- config/db.js

Connect to MongoDB using mongoose.
Use MONGO_URI from environment variables.

- models/Employee.js
Employee Schema:
- employeeId (String, unique, required)
- fullName (String, required)
- email (String, required, unique, email validation)
- department (String, required)
- timestamps

- models/Attendance.js
Attendance Schema:
- employeeId (String, required)
- date (String YYYY-MM-DD, required)
- status (Present or Absent)
- timestamps

Create unique index:
(employeeId + date)

- controllers/employeeController.js
Functions:
- createEmployee
- getEmployees
- deleteEmployee

Validations:
- Required fields
- Email format
- Duplicate employeeId/email

- controllers/attendanceController.js
Functions:
- markAttendance
- getAttendanceByEmployee
- getAttendanceByDate (optional for today view)

Validations:
- Prevent duplicate attendance
- Validate status enum

- routes/employeeRoutes.js
POST   /api/employees
GET    /api/employees
DELETE /api/employees/:employeeId

- routes/attendanceRoutes.js
POST /api/attendance
GET  /api/attendance/:employeeId
GET  /api/attendance?date=YYYY-MM-DD

- middleware/errorMiddleware.js
Central error handler:
Return:
- 400
- 404
- 500
With message

- app.js
- Express setup
- JSON middleware
- Route registration
- Error middleware

- server.js
- Import app
- Connect DB
- Start server on PORT


**Frontend Structure (React)**
frontend/
│
├── public/
│
├── src/
│   ├── components/
│   │   ├── EmployeeForm.js
│   │   ├── EmployeeList.js
│   │   ├── AttendanceHistory.js
│   │   └── Loader.js
│   │
│   ├── pages/
│   │   └── Dashboard.js
│   │
│   ├── services/
│   │   └── api.js
│   │
│   ├── utils/
│   │   └── getTodayDate.js
│   │
│   ├── App.js
│   ├── index.js
│   └── App.css
│
├── .env
└── package.json

**Frontend File Responsibilities**
- services/api.js
Axios instance:
Base URL = REACT_APP_API_URL
Functions:
- getEmployees
- createEmployee
- deleteEmployee
- markAttendance
- getAttendanceByEmployee
- getAttendanceByDate


- utils/getTodayDate.js
Return today's date in YYYY-MM-DD format.

- pages/Dashboard.js
Main page:
- EmployeeForm
- EmployeeList
Fetch employees and today's attendance.

- components/EmployeeForm.js
Fields:
- employeeId
- fullName
- email
- department

On submit:
POST /api/employees

- components/EmployeeList.js
Display table:

Columns:
- Employee ID
- Name
- Email
- Department
- Today Status
- Actions:
   Present
   Absent
   Delete
   View History

Attendance logic:
If today's record exists → show status
Else → Not Marked

- components/AttendanceHistory.js
Show modal:
Table:
- Date
- Status

Fetch:
GET /api/attendance/:employeeId

- components/Loader.js
Simple loading spinner component.

- Environment Variables
backend/.env
- PORT=5000
- MONGO_URI=your_mongodb_connection

frontend/.env
- REACT_APP_API_URL=http://localhost:5173


Generate a complete MERN stack application using the folder structure provided. Implement all APIs, models, validations, and React components according to README requirements. Ensure the project runs without errors.