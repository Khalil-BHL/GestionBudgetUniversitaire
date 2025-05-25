const express = require('express');
const router = express.Router();
const { sendNotification, getUserNotifications, markNotificationAsRead, deleteUserNotifications } = require('../controllers/notificationController');

router.post('/', sendNotification);
router.get('/user/:userId', getUserNotifications);
router.put('/:notificationId/read', markNotificationAsRead);
router.delete('/user/:userId', deleteUserNotifications);

module.exports = router; 