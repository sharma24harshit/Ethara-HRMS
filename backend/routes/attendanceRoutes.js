const express = require('express');
const router = express.Router();
const {
  markAttendance,
  getAttendanceByEmployee,
  getAttendanceByDate,
} = require('../controllers/attendanceController');

router.route('/').post(markAttendance).get(getAttendanceByDate);
router.route('/:employeeId').get(getAttendanceByEmployee);

module.exports = router;