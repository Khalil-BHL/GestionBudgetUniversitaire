const pool = require('../config/db');

/**
 * Get all users with role_id 3 (Professor) and 4 (Chef Departement)
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
const getUsers = async (req, res) => {
  try {
    const [users] = await pool.execute(
      'SELECT id, name, email, role_id FROM users WHERE role_id IN (3, 4) ORDER BY name'
    );
    
    res.json(users);
  } catch (err) {
    console.error('Error fetching users:', err);
    res.status(500).json({
      status: 'error',
      message: 'Server error',
      error: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
  }
};

module.exports = { getUsers }; 