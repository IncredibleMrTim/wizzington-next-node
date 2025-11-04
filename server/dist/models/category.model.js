"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAllCategories = getAllCategories;
exports.getCategoryById = getCategoryById;
exports.createCategory = createCategory;
exports.updateCategory = updateCategory;
exports.deleteCategory = deleteCategory;
const db_1 = __importDefault(require("../db"));
const crypto_1 = require("crypto");
function rowToCategory(row) {
    return {
        id: row.id,
        name: row.name,
        description: row.description,
        createdAt: row.created_at,
        updatedAt: row.updated_at
    };
}
function getAllCategories() {
    const stmt = db_1.default.prepare('SELECT * FROM categories ORDER BY name ASC');
    const rows = stmt.all();
    return rows.map(rowToCategory);
}
function getCategoryById(id) {
    const stmt = db_1.default.prepare('SELECT * FROM categories WHERE id = ?');
    const row = stmt.get(id);
    return row ? rowToCategory(row) : undefined;
}
function createCategory(input) {
    const id = (0, crypto_1.randomUUID)();
    const now = new Date().toISOString();
    const stmt = db_1.default.prepare(`
    INSERT INTO categories (id, name, description, created_at, updated_at)
    VALUES (?, ?, ?, ?, ?)
  `);
    stmt.run(id, input.name, input.description || null, now, now);
    const category = getCategoryById(id);
    if (!category)
        throw new Error('Failed to create category');
    return category;
}
function updateCategory(input) {
    const updates = [];
    const values = [];
    if (input.name !== undefined) {
        updates.push('name = ?');
        values.push(input.name);
    }
    if (input.description !== undefined) {
        updates.push('description = ?');
        values.push(input.description);
    }
    updates.push('updated_at = ?');
    values.push(new Date().toISOString());
    if (updates.length > 1) {
        values.push(input.id);
        const stmt = db_1.default.prepare(`UPDATE categories SET ${updates.join(', ')} WHERE id = ?`);
        stmt.run(...values);
    }
    return getCategoryById(input.id);
}
function deleteCategory(id) {
    const stmt = db_1.default.prepare('DELETE FROM categories WHERE id = ?');
    const result = stmt.run(id);
    return result.changes > 0;
}
