const express = require('express');
const router = express.Router();
const { getDepartments, getDepartmentUsers } = require('../controllers/departmentsController');

router.get('/', getDepartments);
router.get('/:id/users', getDepartmentUsers);

module.exports = router; 