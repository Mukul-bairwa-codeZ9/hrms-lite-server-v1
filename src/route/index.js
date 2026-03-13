const express = require('express');
const router = express.Router();

router.use('/employees', require('./employee.route'));
router.use("/attendance",require("./attendance.route"))

module.exports = router;