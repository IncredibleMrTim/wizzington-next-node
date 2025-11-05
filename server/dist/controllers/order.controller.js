"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAll = getAll;
exports.getById = getById;
exports.create = create;
exports.update = update;
exports.remove = remove;
const order_model_1 = require("../models/order.model");
async function getAll(req, res) {
    try {
        const orders = await (0, order_model_1.getAllOrders)();
        res.json(orders);
    }
    catch (error) {
        console.error('Error fetching orders:', error);
        res.status(500).json({ error: 'Failed to fetch orders' });
    }
}
async function getById(req, res) {
    try {
        const id = req.params.id;
        const order = await (0, order_model_1.getOrderById)(id);
        if (!order) {
            return res.status(404).json({ error: 'Order not found' });
        }
        res.json(order);
    }
    catch (error) {
        console.error('Error fetching order:', error);
        res.status(500).json({ error: 'Failed to fetch order' });
    }
}
async function create(req, res) {
    try {
        const input = req.body;
        if (!input.products || input.products.length === 0) {
            return res.status(400).json({ error: 'Order must have at least one product' });
        }
        const order = await (0, order_model_1.createOrder)(input);
        res.status(201).json(order);
    }
    catch (error) {
        console.error('Error creating order:', error);
        res.status(500).json({ error: 'Failed to create order' });
    }
}
async function update(req, res) {
    try {
        const id = req.params.id;
        const input = { ...req.body, id };
        const order = await (0, order_model_1.updateOrder)(input);
        if (!order) {
            return res.status(404).json({ error: 'Order not found' });
        }
        res.json(order);
    }
    catch (error) {
        console.error('Error updating order:', error);
        res.status(500).json({ error: 'Failed to update order' });
    }
}
async function remove(req, res) {
    try {
        const id = req.params.id;
        const success = await (0, order_model_1.deleteOrder)(id);
        if (!success) {
            return res.status(404).json({ error: 'Order not found' });
        }
        res.status(204).send();
    }
    catch (error) {
        console.error('Error deleting order:', error);
        res.status(500).json({ error: 'Failed to delete order' });
    }
}
