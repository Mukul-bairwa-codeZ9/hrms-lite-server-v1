const Employee = require('../models/employee.model');

const getAllEmployees = async () => {
  return await Employee.find().sort({ createdAt: -1 });
};

const createEmployee = async ({ employeeId, fullName, email, department }) => {
  // Duplicate checks
  const existingById = await Employee.findOne({ employeeId: employeeId.toUpperCase() });
  if (existingById) {
    const error = new Error('Employee ID already exists');
    error.status = 409;
    throw error;
  }

  const existingByEmail = await Employee.findOne({ email: email.toLowerCase() });
  if (existingByEmail) {
    const error = new Error('Email address already registered');
    error.status = 409;
    throw error;
  }

  const employee = await Employee.create({ employeeId, fullName, email, department });
  return employee;
};

const deleteEmployee = async (id) => {
  const employee = await Employee.findById(id);
  if (!employee) {
    const error = new Error('Employee not found');
    error.status = 404;
    throw error;
  }

  // Delete associated attendance records
  const Attendance = require('../models/Attendance');
  await Attendance.deleteMany({ employee: id });

  await Employee.findByIdAndDelete(id);
  return true;
};

module.exports = { getAllEmployees, createEmployee, deleteEmployee };