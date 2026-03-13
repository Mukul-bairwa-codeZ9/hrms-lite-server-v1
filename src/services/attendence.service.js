const Attendance = require('../models/attendence.model');
const Employee = require('../models/employee.model');

const markAttendance = async ({ employeeId, date, status }) => {
  // Validate required fields
  if (!employeeId || !date || !status) {
    const error = new Error('Employee, date, and status are required');
    error.status = 400;
    throw error;
  }

  // Validate date format
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) {
    const error = new Error('Date must be in YYYY-MM-DD format');
    error.status = 400;
    throw error;
  }

  // Check employee exists
  const employee = await Employee.findById(employeeId);
  if (!employee) {
    const error = new Error('Employee not found');
    error.status = 404;
    throw error;
  }

  // Upsert — update if exists, create if not
  const attendance = await Attendance.findOneAndUpdate(
    { employee: employeeId, date },
    { employee: employeeId, date, status },
    { upsert: true, new: true, runValidators: true }
  );

  await attendance.populate('employee', 'fullName employeeId department');
  return attendance;
};

const getAttendance = async ({ employeeId, date, startDate, endDate }) => {
  const filter = {};

  if (employeeId) filter.employee = employeeId;
  if (date) filter.date = date;
  if (startDate || endDate) {
    filter.date = {};
    if (startDate) filter.date.$gte = startDate;
    if (endDate) filter.date.$lte = endDate;
  }

  const records = await Attendance.find(filter)
    .populate('employee', 'fullName employeeId department')
    .sort({ date: -1 });

  // Stats per employee if filtering by employee
  let stats = null;
  if (employeeId) {
    const totalDays = records.length;
    const presentDays = records.filter((r) => r.status === 'Present').length;
    stats = {
      totalDays,
      presentDays,
      absentDays: totalDays - presentDays,
    };
  }

  return { records, stats };
};

const getAttendanceSummary = async () => {
  const today = new Date().toISOString().split('T')[0];

  const [totalEmployees, presentToday, absentToday] = await Promise.all([
    Employee.countDocuments(),
    Attendance.countDocuments({ date: today, status: 'Present' }),
    Attendance.countDocuments({ date: today, status: 'Absent' }),
  ]);

  const perEmployee = await Attendance.aggregate([
    { $match: { status: 'Present' } },
    { $group: { _id: '$employee', presentDays: { $sum: 1 } } },
    {
      $lookup: {
        from: 'employees',
        localField: '_id',
        foreignField: '_id',
        as: 'employee',
      },
    },
    { $unwind: '$employee' },
    {
      $project: {
        _id: 0,
        employeeId: '$employee.employeeId',
        fullName: '$employee.fullName',
        department: '$employee.department',
        presentDays: 1,
      },
    },
    { $sort: { presentDays: -1 } },
  ]);

  return {
    totalEmployees,
    presentToday,
    absentToday,
    notMarkedToday: totalEmployees - presentToday - absentToday,
    perEmployee,
  };
};

module.exports = { markAttendance, getAttendance, getAttendanceSummary };