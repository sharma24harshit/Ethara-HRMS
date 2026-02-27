const Attendance = require('../models/Attendance');
const Employee = require('../models/Employee');

// @desc    Mark attendance
// @route   POST /api/attendance
const markAttendance = async (req, res, next) => {
  try {
    const { employeeId, date, status } = req.body;

    if (!employeeId || !date || !status) {
      const error = new Error('employeeId, date, and status are required');
      error.statusCode = 400;
      return next(error);
    }

    if (!['Present', 'Absent'].includes(status)) {
      const error = new Error('Status must be either Present or Absent');
      error.statusCode = 400;
      return next(error);
    }

    const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
    if (!dateRegex.test(date)) {
      const error = new Error('Date must be in YYYY-MM-DD format');
      error.statusCode = 400;
      return next(error);
    }

    const employee = await Employee.findOne({ employeeId });
    if (!employee) {
      const error = new Error(`Employee with ID '${employeeId}' not found`);
      error.statusCode = 404;
      return next(error);
    }

    const existing = await Attendance.findOne({ employeeId, date });
    if (existing) {
      // Update existing record
      existing.status = status;
      await existing.save();
      return res.status(200).json({ success: true, data: existing, updated: true });
    }

    const attendance = await Attendance.create({ employeeId, date, status });
    res.status(201).json({ success: true, data: attendance });
  } catch (error) {
    if (error.code === 11000) {
      const dupError = new Error('Attendance already marked for this employee on this date');
      dupError.statusCode = 400;
      return next(dupError);
    }
    next(error);
  }
};

// @desc    Get attendance by employee
// @route   GET /api/attendance/:employeeId
const getAttendanceByEmployee = async (req, res, next) => {
  try {
    const { employeeId } = req.params;
    const records = await Attendance.find({ employeeId }).sort({ date: -1 });
    res.status(200).json({ success: true, count: records.length, data: records });
  } catch (error) {
    next(error);
  }
};

// @desc    Get attendance by date
// @route   GET /api/attendance?date=YYYY-MM-DD
const getAttendanceByDate = async (req, res, next) => {
  try {
    const { date } = req.query;
    if (!date) {
      const error = new Error('date query parameter is required');
      error.statusCode = 400;
      return next(error);
    }
    const records = await Attendance.find({ date });
    res.status(200).json({ success: true, count: records.length, data: records });
  } catch (error) {
    next(error);
  }
};

module.exports = { markAttendance, getAttendanceByEmployee, getAttendanceByDate };