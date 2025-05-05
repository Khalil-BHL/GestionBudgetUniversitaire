const mysql = require("mysql2/promise");

console.log("Database configuration:", {
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  database: process.env.DB_NAME,
  // Don't log the password for security
});

const pool = mysql.createPool({
  host: process.env.DB_HOST || "localhost",
  user: process.env.DB_USER || "root",
  password: process.env.DB_PASSWORD || "",
  database: process.env.DB_NAME || "unibudget",
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

// Test the connection
pool
  .getConnection()
  .then((connection) => {
    console.log("Database connected successfully");
    connection.release();
  })
  .catch((err) => {
    console.error("Database connection error:", {
      message: err.message,
      code: err.code,
      errno: err.errno,
      sqlMessage: err.sqlMessage,
    });
  });

module.exports = pool;
