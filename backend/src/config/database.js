const mysql = require("mysql2/promise");

const pool = mysql.createPool({
  host: process.env.DB_HOST || "mysql",
  user: process.env.DB_USER || "isp_user",
  password: process.env.DB_PASSWORD || "isp_password",
  database: process.env.DB_NAME || "isp_management",
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

module.exports = pool;
