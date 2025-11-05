import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

dotenv.config();

const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'wizz_db',
  port: parseInt(process.env.DB_PORT || '3306'),
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  enableKeepAlive: true,
  keepAliveInitialDelay: 0
});

export async function initDB() {
  try {
    const connection = await pool.getConnection();
    console.log('✓ MySQL database connected successfully');
    console.log('Database tables should be created from schema.sql');
    connection.release();
  } catch (error) {
    console.error('✗ MySQL connection error:', error);
    throw error;
  }
}

initDB();

export default pool;
