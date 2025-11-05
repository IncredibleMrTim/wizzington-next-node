"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.initDB = initDB;
const promise_1 = __importDefault(require("mysql2/promise"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const pool = promise_1.default.createPool({
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
async function initDB() {
    try {
        const connection = await pool.getConnection();
        console.log('✓ MySQL database connected successfully');
        console.log('Database tables will be created from schema.sql');
        console.log('Make sure to run the schema.sql file in your MySQL database');
        connection.release();
    }
    catch (error) {
        console.error('✗ MySQL connection error:', error);
        throw error;
    }
}
initDB();
exports.default = pool;
