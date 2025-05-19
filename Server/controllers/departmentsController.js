const pool = require('../config/db');

/**
 * Get all departments
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
const getDepartments = async (req, res) => {
  try {
    const [departments] = await pool.execute(
      'SELECT id, name FROM departments ORDER BY name'
    );
    
    // Return the departments array directly
    res.json(departments);
  } catch (err) {
    console.error('Error fetching departments:', err);
    res.status(500).json({
      status: 'error',
      message: 'Server error',
      error: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
  }
};

module.exports = { getDepartments }; 