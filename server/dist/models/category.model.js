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
async function getAllCategories() {
    const [rows] = await db_1.default.query('SELECT * FROM categories ORDER BY name ASC');
    return rows.map(rowToCategory);
}
async function getCategoryById(id) {
    const [rows] = await db_1.default.query('SELECT * FROM categories WHERE id = ?', [id]);
    return rows.length > 0 ? rowToCategory(rows[0]) : undefined;
}
async function createCategory(input) {
    const id = (0, crypto_1.randomUUID)();
    await db_1.default.query('INSERT INTO categories (id, name, description) VALUES (?, ?, ?)', [id, input.name, input.description || null]);
    const category = await getCategoryById(id);
    if (!category)
        throw new Error('Failed to create category');
    return category;
}
async function updateCategory(input) {
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
    if (updates.length > 0) {
        values.push(input.id);
        await db_1.default.query(`UPDATE categories SET ${updates.join(', ')} WHERE id = ?`, values);
    }
    return getCategoryById(input.id);
}
async function deleteCategory(id) {
    const [result] = await db_1.default.query('DELETE FROM categories WHERE id = ?', [id]);
    return result.affectedRows > 0;
}
