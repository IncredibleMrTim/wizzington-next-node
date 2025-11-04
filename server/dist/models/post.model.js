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
function getAllPosts() {
    const stmt = db_1.default.prepare(`
    SELECT posts.*, users.name as user_name
    FROM posts
    LEFT JOIN users ON posts.user_id = users.id
    ORDER BY posts.created_at DESC
  `);
    return stmt.all();
}
function getPostById(id) {
    const stmt = db_1.default.prepare(`
    SELECT posts.*, users.name as user_name
    FROM posts
    LEFT JOIN users ON posts.user_id = users.id
    WHERE posts.id = ?
  `);
    return stmt.get(id);
}
function createPost(input) {
    const stmt = db_1.default.prepare('INSERT INTO posts (title, content, user_id) VALUES (?, ?, ?)');
    const result = stmt.run(input.title, input.content || null, input.user_id || null);
    const newPost = getPostById(result.lastInsertRowid);
    if (!newPost) {
        throw new Error('Failed to create post');
    }
    return newPost;
}
function updatePost(id, input) {
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
    const stmt = db_1.default.prepare(`UPDATE posts SET ${updates.join(', ')} WHERE id = ?`);
    stmt.run(...values);
    return getPostById(id);
}
function deletePost(id) {
    const stmt = db_1.default.prepare('DELETE FROM posts WHERE id = ?');
    const result = stmt.run(id);
    return result.changes > 0;
}
