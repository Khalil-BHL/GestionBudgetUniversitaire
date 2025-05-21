const express = require('express');
const router = express.Router();
const { sendNotification, getUserNotifications, markNotificationAsRead } = require('../controllers/notificationController');

router.post('/', sendNotification);
router.get('/user/:userId', getUserNotifications);
router.put('/:notificationId/read', markNotificationAsRead);

module.exports = router; 