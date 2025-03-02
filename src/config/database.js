// backend/config/db.js
// const mysql = require('mysql2/promise');
import mysql from "mysql2";

const pool = mysql
  .createPool({
    host: process.env.DB_HOST || "localhost",
    user: process.env.DB_USER || "root",
    password: process.env.DB_PASSWORD || "hmnn",
    database: process.env.DB_NAME || "auth_app",
    port: process.env.DB_PORT || 3306,
    waitForConnections: true, // Ensure pool waits for connections
    connectionLimit: 10, // Limit concurrent connections
    queueLimit: 0,
  })
  .promise();

export default pool;
