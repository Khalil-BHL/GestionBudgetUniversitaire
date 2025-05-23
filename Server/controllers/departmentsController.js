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

/**
 * Get users by department ID
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
const getDepartmentUsers = async (req, res) => {
  try {
    const { id } = req.params;
    
    const [users] = await pool.execute(
      `SELECT u.id, u.name, u.email, u.role_id, r.name as role_name
       FROM users u
       LEFT JOIN roles r ON u.role_id = r.id
       WHERE u.department_id = ?
       ORDER BY u.name`,
      [id]
    );
    
    res.json(users);
  } catch (err) {
    console.error('Error fetching department users:', err);
    res.status(500).json({
      status: 'error',
      message: 'Server error',
      error: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
  }
};

module.exports = { getDepartments, getDepartmentUsers }; 