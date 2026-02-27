import axios from 'axios';

const API = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost:5000',
});

// ── Employees ────────────────────────────────────────────────
export const getEmployees   = ()       => API.get('/api/employees');
export const createEmployee = (data)   => API.post('/api/employees', data);
export const deleteEmployee = (id)     => API.delete(`/api/employees/${id}`);

// ── Attendance ───────────────────────────────────────────────
export const markAttendance = (data) => API.post('/api/attendance', data);

// filters: { month: 'YYYY-MM', date: 'YYYY-MM-DD', status: 'Present'|'Absent' }
export const getAttendanceByEmployee = (employeeId, filters = {}) => {
  const params = new URLSearchParams();
  if (filters.month)  params.set('month',  filters.month);
  if (filters.date)   params.set('date',   filters.date);
  if (filters.status) params.set('status', filters.status);
  const qs = params.toString();
  return API.get(`/api/attendance/${employeeId}${qs ? `?${qs}` : ''}`);
};

export const getAttendanceByDate = (date) =>
  API.get(`/api/attendance?date=${date}`);

// Returns { employeeId -> { totalPresent, totalAbsent, totalMarked } }
export const getAttendanceSummary = () => API.get('/api/attendance/summary');

export default API;