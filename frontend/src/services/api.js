import axios from 'axios';

const API = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost:5000',
});

export const getEmployees = () => API.get('/api/employees');
export const createEmployee = (data) => API.post('/api/employees', data);
export const deleteEmployee = (employeeId) => API.delete(`/api/employees/${employeeId}`);

export const markAttendance = (data) => API.post('/api/attendance', data);
export const getAttendanceByEmployee = (employeeId) => API.get(`/api/attendance/${employeeId}`);
export const getAttendanceByDate = (date) => API.get(`/api/attendance?date=${date}`);

export default API;