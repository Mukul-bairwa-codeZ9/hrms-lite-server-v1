const attendanceService = require('../services/attendence.service');

const markAttendance = async (req, res, next) => {
  try {
    const attendance = await attendanceService.markAttendance(req.body);
    res.status(201).json({ success: true, data: attendance, message: 'Attendance marked successfully' });
  } catch (error) {
    next(error);
  }
};

const getAttendance = async (req, res, next) => {
  try {
    const { records, stats } = await attendanceService.getAttendance(req.query);
    res.json({ success: true, count: records.length, data: records, stats });
  } catch (error) {
    next(error);
  }
};

const getAttendanceSummary = async (req, res, next) => {
  try {
    const summary = await attendanceService.getAttendanceSummary();
    res.json({ success: true, data: summary });
  } catch (error) {
    next(error);
  }
};

module.exports = { markAttendance, getAttendance, getAttendanceSummary };