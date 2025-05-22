const pool = require('../config/db');

/**
 * Get all roles
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
const getRoles = async (req, res) => {
  try {
    const [roles] = await pool.execute(
      'SELECT id, name FROM roles ORDER BY name'
    );
    
    res.json(roles);
  } catch (err) {
    console.error('Error fetching roles:', err);
    res.status(500).json({
      status: 'error',
      message: 'Server error',
      error: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
  }
};

module.exports = { getRoles }; 