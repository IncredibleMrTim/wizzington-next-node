"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAll = getAll;
exports.getById = getById;
exports.create = create;
exports.update = update;
exports.remove = remove;
const user_model_1 = require("../models/user.model");
async function getAll(req, res) {
    try {
        const users = (0, user_model_1.getAllUsers)();
        res.json(users);
    }
    catch (error) {
        console.error('Error fetching users:', error);
        res.status(500).json({ error: 'Failed to fetch users' });
    }
}
async function getById(req, res) {
    try {
        const id = parseInt(req.params.id);
        const user = (0, user_model_1.getUserById)(id);
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }
        res.json(user);
    }
    catch (error) {
        console.error('Error fetching user:', error);
        res.status(500).json({ error: 'Failed to fetch user' });
    }
}
async function create(req, res) {
    try {
        const input = req.body;
        if (!input.name || !input.email) {
            return res.status(400).json({ error: 'Name and email are required' });
        }
        const user = (0, user_model_1.createUser)(input);
        res.status(201).json(user);
    }
    catch (error) {
        console.error('Error creating user:', error);
        if (error.message?.includes('UNIQUE constraint failed')) {
            return res.status(409).json({ error: 'Email already exists' });
        }
        res.status(500).json({ error: 'Failed to create user' });
    }
}
async function update(req, res) {
    try {
        const id = parseInt(req.params.id);
        const input = req.body;
        const user = (0, user_model_1.updateUser)(id, input);
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }
        res.json(user);
    }
    catch (error) {
        console.error('Error updating user:', error);
        if (error.message?.includes('UNIQUE constraint failed')) {
            return res.status(409).json({ error: 'Email already exists' });
        }
        res.status(500).json({ error: 'Failed to update user' });
    }
}
async function remove(req, res) {
    try {
        const id = parseInt(req.params.id);
        const success = (0, user_model_1.deleteUser)(id);
        if (!success) {
            return res.status(404).json({ error: 'User not found' });
        }
        res.status(204).send();
    }
    catch (error) {
        console.error('Error deleting user:', error);
        res.status(500).json({ error: 'Failed to delete user' });
    }
}
