const dotenv = require('dotenv');
const pool = require('../config/db');

/**
 * Login user
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
const login = async (req, res) => {
  const { email, password } = req.body;
  
  console.log('Login attempt for:', email);
  
  // Validate input
  if (!email || !password) {
    return res.status(400).json({ 
      status: 'error',
      message: 'Email and password are required' 
    });
  }

  try {
    console.log('Attempting database query...');
    
    // Find user by email with role name from roles table
    const [users] = await pool.execute(
      'SELECT u.*, r.name as role_name FROM users u LEFT JOIN roles r ON u.role_id = r.id WHERE u.email = ?', 
      [email]
    );
    console.log('Database query result:', users);
    
    if (users.length === 0) {
      console.log('No user found with email:', email);
      return res.status(400).json({ 
        status: 'error',
        message: 'Invalid credentials' 
      });
    }

    const user = users[0];
    console.log('User found:', { 
      id: user.id, 
      name: user.name, 
      email: user.email, 
      role: user.role_name 
    });
    
    // Check if password matches
    if (user.password !== password) {
      console.log('Password mismatch for user:', email);
      return res.status(400).json({ 
        status: 'error',
        message: 'Invalid credentials' 
      });
    }
    
    // Return user data with role
    const response = { 
      status: 'success',
      user: { 
        id: user.id, 
        name: user.name, 
        email: user.email,
        role: user.role_name // Use role_name from the join
      }
    };
    
    console.log('Sending response:', response);
    res.json(response);
  } catch (err) {
    console.error('Login error details:', {
      message: err.message,
      stack: err.stack,
      code: err.code,
      sqlMessage: err.sqlMessage
    });
    
    res.status(500).json({ 
      status: 'error',
      message: 'Server error', 
      error: process.env.NODE_ENV === 'development' ? err.message : undefined 
    });
  }
};

module.exports = { login };