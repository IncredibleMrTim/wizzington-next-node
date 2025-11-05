"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAllUsers = getAllUsers;
exports.getUserById = getUserById;
exports.createUser = createUser;
exports.updateUser = updateUser;
exports.deleteUser = deleteUser;
const db_1 = __importDefault(require("../db"));
const crypto_1 = require("crypto");
async function getAllUsers() {
    const [rows] = await db_1.default.query('SELECT * FROM users ORDER BY created_at DESC');
    return rows;
}
async function getUserById(id) {
    const [rows] = await db_1.default.query('SELECT * FROM users WHERE id = ?', [id]);
    return rows.length > 0 ? rows[0] : undefined;
}
async function createUser(input) {
    const id = (0, crypto_1.randomUUID)();
    await db_1.default.query('INSERT INTO users (id, name, email) VALUES (?, ?, ?)', [id, input.name, input.email]);
    const user = await getUserById(id);
    if (!user)
        throw new Error('Failed to create user');
    return user;
}
async function updateUser(id, input) {
    const updates = [];
    const values = [];
    if (input.name !== undefined) {
        updates.push('name = ?');
        values.push(input.name);
    }
    if (input.email !== undefined) {
        updates.push('email = ?');
        values.push(input.email);
    }
    if (updates.length === 0) {
        return getUserById(id);
    }
    values.push(id);
    await db_1.default.query(`UPDATE users SET ${updates.join(', ')} WHERE id = ?`, values);
    return getUserById(id);
}
async function deleteUser(id) {
    const [result] = await db_1.default.query('DELETE FROM users WHERE id = ?', [id]);
    return result.affectedRows > 0;
}
