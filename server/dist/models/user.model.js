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
function getAllUsers() {
    const stmt = db_1.default.prepare('SELECT * FROM users ORDER BY created_at DESC');
    return stmt.all();
}
function getUserById(id) {
    const stmt = db_1.default.prepare('SELECT * FROM users WHERE id = ?');
    return stmt.get(id);
}
function createUser(input) {
    const stmt = db_1.default.prepare('INSERT INTO users (name, email) VALUES (?, ?)');
    const result = stmt.run(input.name, input.email);
    const newUser = db_1.default.prepare('SELECT * FROM users WHERE id = ?').get(result.lastInsertRowid);
    return newUser;
}
function updateUser(id, input) {
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
    const stmt = db_1.default.prepare(`UPDATE users SET ${updates.join(', ')} WHERE id = ?`);
    stmt.run(...values);
    return getUserById(id);
}
function deleteUser(id) {
    const stmt = db_1.default.prepare('DELETE FROM users WHERE id = ?');
    const result = stmt.run(id);
    return result.changes > 0;
}
