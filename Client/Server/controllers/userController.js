const pool = require('../config/db');

/**
 * Get all users except Admin role (id=5)
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
const getUsers = async (req, res) => {
  try {
    const [users] = await pool.execute(
      `SELECT u.id, u.name, u.email, u.role_id, d.name as department, r.name as role_name
       FROM users u 
       LEFT JOIN departments d ON u.department_id = d.id 
       LEFT JOIN roles r ON u.role_id = r.id
       WHERE u.role_id != 5
       ORDER BY u.name`
    );
    
    // Map role_id to role name
    const mappedUsers = users.map(user => ({
      ...user,
      role: user.role_name
    }));
    
    res.json(mappedUsers);
  } catch (err) {
    console.error('Error fetching users:', err);
    res.status(500).json({
      status: 'error',
      message: 'Server error',
      error: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
  }
};

/**
 * Create a new user
 */
const createUser = async (req, res) => {
  try {
    const { name, email, password, role_id, department } = req.body;
    
    // Validate required fields
    if (!name || !email || !password || !role_id) {
      return res.status(400).json({
        status: 'error',
        message: 'Name, email, password, and role are required'
      });
    }

    let department_id = null;
    if (department) {
      // Get or create department
      const [departments] = await pool.execute(
        'SELECT id FROM departments WHERE name = ?',
        [department]
      );

      if (departments.length === 0) {
        const [result] = await pool.execute(
          'INSERT INTO departments (name) VALUES (?)',
          [department]
        );
        department_id = result.insertId;
      } else {
        department_id = departments[0].id;
      }
    }

    // Insert user
    const [result] = await pool.execute(
      'INSERT INTO users (name, email, password, role_id, department_id) VALUES (?, ?, ?, ?, ?)',
      [name, email, password, role_id, department_id]
    );

    // Get the created user
    const [newUser] = await pool.execute(
      `SELECT u.id, u.name, u.email, u.role_id, d.name as department, r.name as role_name
       FROM users u 
       LEFT JOIN departments d ON u.department_id = d.id 
       LEFT JOIN roles r ON u.role_id = r.id
       WHERE u.id = ?`,
      [result.insertId]
    );

    // Map role_id to role name
    const mappedUser = {
      ...newUser[0],
      role: newUser[0].role_name
    };

    res.status(201).json(mappedUser);
  } catch (err) {
    console.error('Error creating user:', err);
    res.status(500).json({
      status: 'error',
      message: 'Server error',
      error: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
  }
};

/**
 * Update a user
 */
const updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, email, password, role_id, department } = req.body;

    let department_id = null;
    if (department) {
      // Get or create department
      const [departments] = await pool.execute(
        'SELECT id FROM departments WHERE name = ?',
        [department]
      );

      if (departments.length === 0) {
        const [result] = await pool.execute(
          'INSERT INTO departments (name) VALUES (?)',
          [department]
        );
        department_id = result.insertId;
      } else {
        department_id = departments[0].id;
      }
    }

    // If password is provided, update it
    let updateQuery = 'UPDATE users SET name = ?, email = ?, role_id = ?, department_id = ?';
    let queryParams = [name, email, role_id, department_id];

    if (password) {
      updateQuery += ', password = ?';
      queryParams.push(password);
    }

    updateQuery += ' WHERE id = ?';
    queryParams.push(id);

    await pool.execute(updateQuery, queryParams);

    // Get the updated user
    const [updatedUser] = await pool.execute(
      `SELECT u.id, u.name, u.email, u.role_id, d.name as department, r.name as role_name
       FROM users u 
       LEFT JOIN departments d ON u.department_id = d.id 
       LEFT JOIN roles r ON u.role_id = r.id
       WHERE u.id = ?`,
      [id]
    );

    if (updatedUser.length === 0) {
      return res.status(404).json({
        status: 'error',
        message: 'User not found'
      });
    }

    // Map role_id to role name
    const mappedUser = {
      ...updatedUser[0],
      role: updatedUser[0].role_name
    };

    res.json(mappedUser);
  } catch (err) {
    console.error('Error updating user:', err);
    res.status(500).json({
      status: 'error',
      message: 'Server error',
      error: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
  }
};

/**
 * Delete a user
 */
const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;

    // Check if user exists
    const [user] = await pool.execute(
      'SELECT id FROM users WHERE id = ?',
      [id]
    );

    if (user.length === 0) {
      return res.status(404).json({
        status: 'error',
        message: 'User not found'
      });
    }

    // Delete user
    await pool.execute('DELETE FROM users WHERE id = ?', [id]);

    res.json({
      status: 'success',
      message: 'User deleted successfully'
    });
  } catch (err) {
    console.error('Error deleting user:', err);
    res.status(500).json({
      status: 'error',
      message: 'Server error',
      error: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
  }
};

module.exports = { getUsers, createUser, updateUser, deleteUser }; 