"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAllProducts = getAllProducts;
exports.getProductById = getProductById;
exports.createProduct = createProduct;
exports.updateProduct = updateProduct;
exports.deleteProduct = deleteProduct;
exports.getProductsByCategory = getProductsByCategory;
const db_1 = __importDefault(require("../db"));
const crypto_1 = require("crypto");
function rowToProduct(row) {
    return {
        id: row.id,
        name: row.name,
        description: row.description,
        price: row.price,
        stock: row.stock,
        isFeatured: Boolean(row.is_featured),
        isEnquiryOnly: Boolean(row.is_enquiry_only),
        category: row.category_id,
        images: [],
        createdAt: row.created_at,
        updatedAt: row.updated_at
    };
}
async function getProductImages(productId) {
    const [rows] = await db_1.default.query(`SELECT id, product_id, url, order_position as 'order', created_at
     FROM product_images
     WHERE product_id = ?
     ORDER BY order_position ASC`, [productId]);
    return rows;
}
async function getAllProducts(options) {
    let query = 'SELECT * FROM products WHERE 1=1';
    const params = [];
    if (options?.isFeatured !== undefined) {
        query += ' AND is_featured = ?';
        params.push(options.isFeatured ? 1 : 0);
    }
    if (options?.category) {
        query += ' AND category_id = ?';
        params.push(options.category);
    }
    query += ' ORDER BY created_at DESC';
    const [rows] = await db_1.default.query(query, params);
    const products = await Promise.all(rows.map(async (row) => {
        const product = rowToProduct(row);
        product.images = await getProductImages(product.id);
        return product;
    }));
    return products;
}
async function getProductById(id) {
    const [rows] = await db_1.default.query('SELECT * FROM products WHERE id = ?', [id]);
    if (rows.length === 0)
        return undefined;
    const product = rowToProduct(rows[0]);
    product.images = await getProductImages(product.id);
    return product;
}
async function createProduct(input) {
    const id = (0, crypto_1.randomUUID)();
    await db_1.default.query(`INSERT INTO products (
      id, name, description, price, stock,
      is_featured, is_enquiry_only, category_id
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`, [
        id,
        input.name,
        input.description || null,
        input.price || 0,
        input.stock || 0,
        input.isFeatured ? 1 : 0,
        input.isEnquiryOnly ? 1 : 0,
        input.category || null
    ]);
    if (input.images && input.images.length > 0) {
        const imageValues = input.images.map(img => [
            (0, crypto_1.randomUUID)(),
            id,
            img.url,
            img.order
        ]);
        await db_1.default.query(`INSERT INTO product_images (id, product_id, url, order_position) VALUES ?`, [imageValues]);
    }
    const product = await getProductById(id);
    if (!product)
        throw new Error('Failed to create product');
    return product;
}
async function updateProduct(input) {
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
    if (input.price !== undefined) {
        updates.push('price = ?');
        values.push(input.price);
    }
    if (input.stock !== undefined) {
        updates.push('stock = ?');
        values.push(input.stock);
    }
    if (input.isFeatured !== undefined) {
        updates.push('is_featured = ?');
        values.push(input.isFeatured ? 1 : 0);
    }
    if (input.isEnquiryOnly !== undefined) {
        updates.push('is_enquiry_only = ?');
        values.push(input.isEnquiryOnly ? 1 : 0);
    }
    if (input.category !== undefined) {
        updates.push('category_id = ?');
        values.push(input.category);
    }
    if (updates.length > 0) {
        values.push(input.id);
        await db_1.default.query(`UPDATE products SET ${updates.join(', ')} WHERE id = ?`, values);
    }
    if (input.images !== undefined) {
        await db_1.default.query('DELETE FROM product_images WHERE product_id = ?', [input.id]);
        if (input.images.length > 0) {
            const imageValues = input.images.map(img => [
                (0, crypto_1.randomUUID)(),
                input.id,
                img.url,
                img.order
            ]);
            await db_1.default.query(`INSERT INTO product_images (id, product_id, url, order_position) VALUES ?`, [imageValues]);
        }
    }
    return getProductById(input.id);
}
async function deleteProduct(id) {
    const [result] = await db_1.default.query('DELETE FROM products WHERE id = ?', [id]);
    return result.affectedRows > 0;
}
async function getProductsByCategory(categoryId) {
    return getAllProducts({ category: categoryId });
}
