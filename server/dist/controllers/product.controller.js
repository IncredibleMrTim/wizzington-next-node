"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAll = getAll;
exports.getById = getById;
exports.getByCategory = getByCategory;
exports.create = create;
exports.update = update;
exports.remove = remove;
const product_model_1 = require("../models/product.model");
async function getAll(req, res) {
    try {
        const isFeatured = req.query.isFeatured === 'true' ? true : req.query.isFeatured === 'false' ? false : undefined;
        const category = req.query.category;
        const products = await (0, product_model_1.getAllProducts)({ isFeatured, category });
        res.json(products);
    }
    catch (error) {
        console.error('Error fetching products:', error);
        res.status(500).json({ error: 'Failed to fetch products' });
    }
}
async function getById(req, res) {
    try {
        const id = req.params.id;
        const product = await (0, product_model_1.getProductById)(id);
        if (!product) {
            return res.status(404).json({ error: 'Product not found' });
        }
        res.json(product);
    }
    catch (error) {
        console.error('Error fetching product:', error);
        res.status(500).json({ error: 'Failed to fetch product' });
    }
}
async function getByCategory(req, res) {
    try {
        const categoryId = req.params.categoryId;
        const products = await (0, product_model_1.getProductsByCategory)(categoryId);
        res.json(products);
    }
    catch (error) {
        console.error('Error fetching products by category:', error);
        res.status(500).json({ error: 'Failed to fetch products by category' });
    }
}
async function create(req, res) {
    try {
        const input = req.body;
        if (!input.name) {
            return res.status(400).json({ error: 'Name is required' });
        }
        const product = await (0, product_model_1.createProduct)(input);
        res.status(201).json(product);
    }
    catch (error) {
        console.error('Error creating product:', error);
        res.status(500).json({ error: 'Failed to create product' });
    }
}
async function update(req, res) {
    try {
        const id = req.params.id;
        const input = { ...req.body, id };
        const product = await (0, product_model_1.updateProduct)(input);
        if (!product) {
            return res.status(404).json({ error: 'Product not found' });
        }
        res.json(product);
    }
    catch (error) {
        console.error('Error updating product:', error);
        res.status(500).json({ error: 'Failed to update product' });
    }
}
async function remove(req, res) {
    try {
        const id = req.params.id;
        const success = await (0, product_model_1.deleteProduct)(id);
        if (!success) {
            return res.status(404).json({ error: 'Product not found' });
        }
        res.status(204).send();
    }
    catch (error) {
        console.error('Error deleting product:', error);
        res.status(500).json({ error: 'Failed to delete product' });
    }
}
