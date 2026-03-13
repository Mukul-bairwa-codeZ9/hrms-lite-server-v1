const express = require('express');
const router = express.Router();
const { getAllEmployees, createEmployee, deleteEmployee } = require('../controllers/employee.controller');
const { validateEmployee } = require('../middleware/validators/employee.validator');

router.get('/', getAllEmployees);
router.post('/', validateEmployee, createEmployee);
router.delete('/:id', deleteEmployee);

module.exports = router;