const express = require('express');
const router = express.Router();
const { getTypeMarches } = require('../controllers/typeMarchesController');

router.get('/', getTypeMarches);

module.exports = router; 