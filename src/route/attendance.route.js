const express = require('express');
const router = express.Router();
const { markAttendance, getAttendance, getAttendanceSummary } = require('../controllers/attendence.controller');

router.get('/summary', getAttendanceSummary);
router.get('/', getAttendance);
router.post('/', markAttendance);

module.exports = router;