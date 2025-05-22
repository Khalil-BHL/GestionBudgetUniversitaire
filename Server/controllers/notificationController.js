const pool = require('../config/db');

const sendNotification = async (req, res) => {
  const connection = await pool.getConnection();
  
  try {
    const { title, message, user_id, sender_id } = req.body;

    // Validate required fields
    if (!title || !message || !user_id || !sender_id) {
      return res.status(400).json({
        status: 'error',
        message: 'Missing required fields'
      });
    }

    // Start transaction
    await connection.beginTransaction();

    // Insert notification
    const [result] = await connection.query(
      'INSERT INTO notifications (destinator_user_id, title, message, created_at) VALUES (?, ?, ?, CURRENT_TIMESTAMP)',
      [user_id, title, message]
    );

    // Commit transaction
    await connection.commit();

    res.status(201).json({
      status: 'success',
      message: 'Notification sent successfully',
      notificationId: result.insertId
    });

  } catch (err) {
    // Rollback in case of error
    await connection.rollback();
    console.error('Error sending notification:', err);
    res.status(500).json({
      status: 'error',
      message: 'Failed to send notification',
      error: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
  } finally {
    connection.release();
  }
};

const getUserNotifications = async (req, res) => {
  try {
    const userId = req.params.userId;

    // Get notifications for the user
    const [notifications] = await pool.query(
      `SELECT n.id, n.title, n.message, n.is_read, n.created_at,
              n.request_id
       FROM notifications n
       WHERE n.destinator_user_id = ? 
       ORDER BY n.created_at DESC`,
      [userId]
    );

    res.json({
      status: 'success',
      notifications
    });

  } catch (err) {
    console.error('Error fetching notifications:', err);
    res.status(500).json({
      status: 'error',
      message: 'Failed to fetch notifications',
      error: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
  }
};

const markNotificationAsRead = async (req, res) => {
  const connection = await pool.getConnection();
  
  try {
    const { notificationId } = req.params;

    // Start transaction
    await connection.beginTransaction();

    // Update notification read status
    await connection.query(
      'UPDATE notifications SET is_read = TRUE WHERE id = ?',
      [notificationId]
    );

    // Commit transaction
    await connection.commit();

    res.json({
      status: 'success',
      message: 'Notification marked as read'
    });

  } catch (err) {
    // Rollback in case of error
    await connection.rollback();
    console.error('Error marking notification as read:', err);
    res.status(500).json({
      status: 'error',
      message: 'Failed to mark notification as read',
      error: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
  } finally {
    connection.release();
  }
};

const deleteUserNotifications = async (req, res) => {
  const connection = await pool.getConnection();
  
  try {
    const userId = req.params.userId;

    // Start transaction
    await connection.beginTransaction();

    // Delete all notifications for the user
    await connection.query(
      'DELETE FROM notifications WHERE destinator_user_id = ?',
      [userId]
    );

    // Commit transaction
    await connection.commit();

    res.json({
      status: 'success',
      message: 'User notifications deleted successfully'
    });

  } catch (err) {
    // Rollback in case of error
    await connection.rollback();
    console.error('Error deleting user notifications:', err);
    res.status(500).json({
      status: 'error',
      message: 'Failed to delete user notifications',
      error: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
  } finally {
    connection.release();
  }
};

module.exports = {
  sendNotification,
  getUserNotifications,
  markNotificationAsRead,
  deleteUserNotifications
}; 