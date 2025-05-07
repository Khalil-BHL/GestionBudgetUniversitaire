const express = require('express');
const router = express.Router();
const { createPurchaseRequest } = require('../controllers/purchaseRequestsController');

router.post('/', createPurchaseRequest);

module.exports = router; 