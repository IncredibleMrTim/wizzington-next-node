"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAllPosts = getAllPosts;
exports.getPostById = getPostById;
exports.createPost = createPost;
exports.updatePost = updatePost;
exports.deletePost = deletePost;
const db_1 = __importDefault(require("../db"));
async function getAllPosts() {
    const [rows] = await db_1.default.query(`
    SELECT posts.*, users.name as user_name
    FROM posts
    LEFT JOIN users ON posts.user_id = users.id
    ORDER BY posts.created_at DESC
  `);
    return rows;
}
async function getPostById(id) {
    const [rows] = await db_1.default.query(`
    SELECT posts.*, users.name as user_name
    FROM posts
    LEFT JOIN users ON posts.user_id = users.id
    WHERE posts.id = ?
  `, [id]);
    return rows.length > 0 ? rows[0] : undefined;
}
async function createPost(input) {
    const [result] = await db_1.default.query('INSERT INTO posts (title, content, user_id) VALUES (?, ?, ?)', [input.title, input.content || null, input.user_id || null]);
    const newPost = await getPostById(result.insertId);
    if (!newPost) {
        throw new Error('Failed to create post');
    }
    return newPost;
}
async function updatePost(id, input) {
    const updates = [];
    const values = [];
    if (input.title !== undefined) {
        updates.push('title = ?');
        values.push(input.title);
    }
    if (input.content !== undefined) {
        updates.push('content = ?');
        values.push(input.content);
    }
    if (input.user_id !== undefined) {
        updates.push('user_id = ?');
        values.push(input.user_id);
    }
    if (updates.length === 0) {
        return getPostById(id);
    }
    values.push(id);
    await db_1.default.query(`UPDATE posts SET ${updates.join(', ')} WHERE id = ?`, values);
    return getPostById(id);
}
async function deletePost(id) {
    const [result] = await db_1.default.query('DELETE FROM posts WHERE id = ?', [id]);
    return result.affectedRows > 0;
}
