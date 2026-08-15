/**
 * mysql.js — MySQL Database Connection Pool for Mangalam Travel & Tours
 * Hostinger Production Database
 */
require('dotenv').config();
const mysql = require('mysql2/promise');

const pool = mysql.createPool({
  host: process.env.DB_HOST || '127.0.0.1',
  port: Number(process.env.DB_PORT) || 3306,
  user: process.env.DB_USER || 'u614850386_mangalam123',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'u614850386_mangalam',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  enableKeepAlive: true,
  keepAliveInitialDelay: 10000,
  charset: 'utf8mb4'
});

async function query(sql, params = []) {
  try {
    const [results] = await pool.query(sql, params);
    return results;
  } catch (err) {
    // Sanitize error logging to ensure credentials are never leaked
    console.error(`❌ Database Query Error: ${err.message}`);
    throw err;
  }
}

async function testConnection() {
  try {
    const connection = await pool.getConnection();
    console.log(`✅ Connected to MySQL Database: ${process.env.DB_NAME || 'u614850386_mangalam'} on ${process.env.DB_HOST || '127.0.0.1'}`);
    connection.release();
    return true;
  } catch (err) {
    console.error(`⚠️ MySQL Connection Warning: ${err.message}`);
    return false;
  }
}

module.exports = {
  pool,
  query,
  testConnection
};
