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
async function getOrderProducts(orderId) {
    const [rows] = await db_1.default.query(`SELECT id, order_id, product_id as productId, product_name as name, quantity, price, created_at
     FROM order_products
     WHERE order_id = ?
     ORDER BY created_at ASC`, [orderId]);
    return rows.map(p => ({ ...p, uid: p.id }));
}
async function getAllOrders() {
    const [rows] = await db_1.default.query('SELECT * FROM orders ORDER BY created_at DESC');
    const orders = await Promise.all(rows.map(async (row) => {
        const order = rowToOrder(row);
        order.products = await getOrderProducts(order.id);
        return order;
    }));
    return orders;
}
async function getOrderById(id) {
    const [rows] = await db_1.default.query('SELECT * FROM orders WHERE id = ?', [id]);
    if (rows.length === 0)
        return undefined;
    const order = rowToOrder(rows[0]);
    order.products = await getOrderProducts(order.id);
    return order;
}
async function createOrder(input) {
    const id = (0, crypto_1.randomUUID)();
    const totalAmount = input.products.reduce((sum, p) => sum + (p.price * p.quantity), 0);
    await db_1.default.query(`INSERT INTO orders (
      id, customer_name, customer_email, customer_phone,
      status, total_amount, notes
    ) VALUES (?, ?, ?, ?, ?, ?, ?)`, [
        id,
        input.customer_name || null,
        input.customer_email || null,
        input.customer_phone || null,
        'pending',
        totalAmount,
        input.notes || null
    ]);
    if (input.products && input.products.length > 0) {
        const productValues = input.products.map(product => [
            (0, crypto_1.randomUUID)(),
            id,
            product.productId,
            product.name,
            product.quantity,
            product.price
        ]);
        await db_1.default.query(`INSERT INTO order_products (id, order_id, product_id, product_name, quantity, price) VALUES ?`, [productValues]);
    }
    const order = await getOrderById(id);
    if (!order)
        throw new Error('Failed to create order');
    return order;
}
async function updateOrder(input) {
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
    if (input.products !== undefined) {
        const totalAmount = input.products.reduce((sum, p) => sum + (p.price * p.quantity), 0);
        updates.push('total_amount = ?');
        values.push(totalAmount);
    }
    if (updates.length > 0) {
        values.push(input.id);
        await db_1.default.query(`UPDATE orders SET ${updates.join(', ')} WHERE id = ?`, values);
    }
    if (input.products !== undefined) {
        await db_1.default.query('DELETE FROM order_products WHERE order_id = ?', [input.id]);
        if (input.products.length > 0) {
            const productValues = input.products.map(product => [
                product.uid || (0, crypto_1.randomUUID)(),
                input.id,
                product.productId,
                product.name,
                product.quantity,
                product.price
            ]);
            await db_1.default.query(`INSERT INTO order_products (id, order_id, product_id, product_name, quantity, price) VALUES ?`, [productValues]);
        }
    }
    return getOrderById(input.id);
}
async function deleteOrder(id) {
    const [result] = await db_1.default.query('DELETE FROM orders WHERE id = ?', [id]);
    return result.affectedRows > 0;
}
