const employeeService = require('../services/employee.service');

const getAllEmployees = async (req, res, next) => {
  try {
    const employees = await employeeService.getAllEmployees();
    res.json({ success: true, count: employees.length, data: employees });
  } catch (error) {
    next(error);
  }
};

const createEmployee = async (req, res, next) => {
  try {
    const employee = await employeeService.createEmployee(req.body);
    res.status(201).json({ success: true, data: employee, message: 'Employee added successfully' });
  } catch (error) {
    next(error);
  }
};

const deleteEmployee = async (req, res, next) => {
  try {
    await employeeService.deleteEmployee(req.params.id);
    res.json({ success: true, message: 'Employee and associated records deleted successfully' });
  } catch (error) {
    next(error);
  }
};

module.exports = { getAllEmployees, createEmployee, deleteEmployee };