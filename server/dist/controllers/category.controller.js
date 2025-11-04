"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAll = getAll;
exports.getById = getById;
exports.create = create;
exports.update = update;
exports.remove = remove;
const category_model_1 = require("../models/category.model");
async function getAll(req, res) {
    try {
        const categories = (0, category_model_1.getAllCategories)();
        res.json(categories);
    }
    catch (error) {
        console.error('Error fetching categories:', error);
        res.status(500).json({ error: 'Failed to fetch categories' });
    }
}
async function getById(req, res) {
    try {
        const id = req.params.id;
        const category = (0, category_model_1.getCategoryById)(id);
        if (!category) {
            return res.status(404).json({ error: 'Category not found' });
        }
        res.json(category);
    }
    catch (error) {
        console.error('Error fetching category:', error);
        res.status(500).json({ error: 'Failed to fetch category' });
    }
}
async function create(req, res) {
    try {
        const input = req.body;
        if (!input.name) {
            return res.status(400).json({ error: 'Name is required' });
        }
        const category = (0, category_model_1.createCategory)(input);
        res.status(201).json(category);
    }
    catch (error) {
        console.error('Error creating category:', error);
        if (error.message?.includes('UNIQUE constraint failed')) {
            return res.status(409).json({ error: 'Category name already exists' });
        }
        res.status(500).json({ error: 'Failed to create category' });
    }
}
async function update(req, res) {
    try {
        const id = req.params.id;
        const input = { ...req.body, id };
        const category = (0, category_model_1.updateCategory)(input);
        if (!category) {
            return res.status(404).json({ error: 'Category not found' });
        }
        res.json(category);
    }
    catch (error) {
        console.error('Error updating category:', error);
        if (error.message?.includes('UNIQUE constraint failed')) {
            return res.status(409).json({ error: 'Category name already exists' });
        }
        res.status(500).json({ error: 'Failed to update category' });
    }
}
async function remove(req, res) {
    try {
        const id = req.params.id;
        const success = (0, category_model_1.deleteCategory)(id);
        if (!success) {
            return res.status(404).json({ error: 'Category not found' });
        }
        res.status(204).send();
    }
    catch (error) {
        console.error('Error deleting category:', error);
        res.status(500).json({ error: 'Failed to delete category' });
    }
}
