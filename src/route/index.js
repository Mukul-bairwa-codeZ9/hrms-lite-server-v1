const express = require('express');
const router = express.Router();

router.use('/employees', require('./employee.route'));

module.exports = router;