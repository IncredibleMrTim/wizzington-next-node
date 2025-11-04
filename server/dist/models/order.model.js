"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAllOrders = getAllOrders;
exports.getOrderById = getOrderById;
exports.createOrder = createOrder;
exports.updateOrder = updateOrder;
exports.deleteOrder = deleteOrder;
const db_1 = __importDefault(require("../db"));
const crypto_1 = require("crypto");
function rowToOrder(row) {
    return {
        id: row.id,
        customer_name: row.customer_name,
        customer_email: row.customer_email,
        customer_phone: row.customer_phone,
        status: row.status,
        total_amount: row.total_amount,
        notes: row.notes,
        products: [],
        createdAt: row.created_at,
        updatedAt: row.updated_at
    };
}
function getOrderProducts(orderId) {
    const stmt = db_1.default.prepare(`
    SELECT id, order_id, product_id as productId, product_name as name, quantity, price, created_at
    FROM order_products
    WHERE order_id = ?
    ORDER BY created_at ASC
  `);
    const products = stmt.all(orderId);
    return products.map(p => ({ ...p, uid: p.id }));
}
function getAllOrders() {
    const stmt = db_1.default.prepare('SELECT * FROM orders ORDER BY created_at DESC');
    const rows = stmt.all();
    return rows.map(row => {
        const order = rowToOrder(row);
        order.products = getOrderProducts(order.id);
        return order;
    });
}
function getOrderById(id) {
    const stmt = db_1.default.prepare('SELECT * FROM orders WHERE id = ?');
    const row = stmt.get(id);
    if (!row)
        return undefined;
    const order = rowToOrder(row);
    order.products = getOrderProducts(order.id);
    return order;
}
function createOrder(input) {
    const id = (0, crypto_1.randomUUID)();
    const now = new Date().toISOString();
    // Calculate total amount
    const totalAmount = input.products.reduce((sum, p) => sum + (p.price * p.quantity), 0);
    const stmt = db_1.default.prepare(`
    INSERT INTO orders (
      id, customer_name, customer_email, customer_phone,
      status, total_amount, notes, created_at, updated_at
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);
    stmt.run(id, input.customer_name || null, input.customer_email || null, input.customer_phone || null, 'pending', totalAmount, input.notes || null, now, now);
    // Add order products
    if (input.products && input.products.length > 0) {
        const productStmt = db_1.default.prepare(`
      INSERT INTO order_products (id, order_id, product_id, product_name, quantity, price, created_at)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `);
        for (const product of input.products) {
            productStmt.run((0, crypto_1.randomUUID)(), id, product.productId, product.name, product.quantity, product.price, now);
        }
    }
    const order = getOrderById(id);
    if (!order)
        throw new Error('Failed to create order');
    return order;
}
function updateOrder(input) {
    const updates = [];
    const values = [];
    if (input.customer_name !== undefined) {
        updates.push('customer_name = ?');
        values.push(input.customer_name);
    }
    if (input.customer_email !== undefined) {
        updates.push('customer_email = ?');
        values.push(input.customer_email);
    }
    if (input.customer_phone !== undefined) {
        updates.push('customer_phone = ?');
        values.push(input.customer_phone);
    }
    if (input.status !== undefined) {
        updates.push('status = ?');
        values.push(input.status);
    }
    if (input.notes !== undefined) {
        updates.push('notes = ?');
        values.push(input.notes);
    }
    updates.push('updated_at = ?');
    values.push(new Date().toISOString());
    // Update products if provided
    if (input.products !== undefined) {
        const totalAmount = input.products.reduce((sum, p) => sum + (p.price * p.quantity), 0);
        updates.push('total_amount = ?');
        values.push(totalAmount);
    }
    if (updates.length > 1) {
        values.push(input.id);
        const stmt = db_1.default.prepare(`UPDATE orders SET ${updates.join(', ')} WHERE id = ?`);
        stmt.run(...values);
    }
    // Update order products if provided
    if (input.products !== undefined) {
        // Delete existing products
        const deleteStmt = db_1.default.prepare('DELETE FROM order_products WHERE order_id = ?');
        deleteStmt.run(input.id);
        // Insert new products
        if (input.products.length > 0) {
            const productStmt = db_1.default.prepare(`
        INSERT INTO order_products (id, order_id, product_id, product_name, quantity, price, created_at)
        VALUES (?, ?, ?, ?, ?, ?, ?)
      `);
            const now = new Date().toISOString();
            for (const product of input.products) {
                productStmt.run(product.uid || (0, crypto_1.randomUUID)(), input.id, product.productId, product.name, product.quantity, product.price, now);
            }
        }
    }
    return getOrderById(input.id);
}
function deleteOrder(id) {
    const stmt = db_1.default.prepare('DELETE FROM orders WHERE id = ?');
    const result = stmt.run(id);
    return result.changes > 0;
}
