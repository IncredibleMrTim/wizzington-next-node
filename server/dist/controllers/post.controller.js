"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAll = getAll;
exports.getById = getById;
exports.create = create;
exports.update = update;
exports.remove = remove;
const post_model_1 = require("../models/post.model");
async function getAll(req, res) {
    try {
        const posts = await (0, post_model_1.getAllPosts)();
        res.json(posts);
    }
    catch (error) {
        console.error('Error fetching posts:', error);
        res.status(500).json({ error: 'Failed to fetch posts' });
    }
}
async function getById(req, res) {
    try {
        const id = parseInt(req.params.id);
        const post = await (0, post_model_1.getPostById)(id);
        if (!post) {
            return res.status(404).json({ error: 'Post not found' });
        }
        res.json(post);
    }
    catch (error) {
        console.error('Error fetching post:', error);
        res.status(500).json({ error: 'Failed to fetch post' });
    }
}
async function create(req, res) {
    try {
        const input = req.body;
        if (!input.title) {
            return res.status(400).json({ error: 'Title is required' });
        }
        const post = await (0, post_model_1.createPost)(input);
        res.status(201).json(post);
    }
    catch (error) {
        console.error('Error creating post:', error);
        res.status(500).json({ error: 'Failed to create post' });
    }
}
async function update(req, res) {
    try {
        const id = parseInt(req.params.id);
        const input = req.body;
        const post = await (0, post_model_1.updatePost)(id, input);
        if (!post) {
            return res.status(404).json({ error: 'Post not found' });
        }
        res.json(post);
    }
    catch (error) {
        console.error('Error updating post:', error);
        res.status(500).json({ error: 'Failed to update post' });
    }
}
async function remove(req, res) {
    try {
        const id = parseInt(req.params.id);
        const success = await (0, post_model_1.deletePost)(id);
        if (!success) {
            return res.status(404).json({ error: 'Post not found' });
        }
        res.status(204).send();
    }
    catch (error) {
        console.error('Error deleting post:', error);
        res.status(500).json({ error: 'Failed to delete post' });
    }
}
