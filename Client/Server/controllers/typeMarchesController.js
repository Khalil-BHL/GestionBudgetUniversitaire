const pool = require('../config/db');

/**
 * Get all type_marches
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
const getTypeMarches = async (req, res) => {
  try {
    const [typeMarches] = await pool.execute(
      'SELECT id, name FROM type_marches ORDER BY name'
    );
    
    res.json({
      status: 'success',
      data: typeMarches
    });
  } catch (err) {
    console.error('Error fetching type_marches:', err);
    res.status(500).json({
      status: 'error',
      message: 'Server error',
      error: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
  }
};

module.exports = { getTypeMarches }; 