const pool = require('../config/db');

/**
 * Get all statuses
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
const getStatuses = async (req, res) => {
  try {
    const [statuses] = await pool.execute(
      'SELECT id, name FROM status ORDER BY id'
    );
    
    res.json(statuses);
  } catch (err) {
    console.error('Error fetching statuses:', err);
    res.status(500).json({
      status: 'error',
      message: 'Server error',
      error: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
  }
};

module.exports = { getStatuses }; 