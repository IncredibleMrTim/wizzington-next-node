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
// Helper function to convert database row to Product with images
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
// Get images for a product
function getProductImages(productId) {
    const stmt = db_1.default.prepare(`
    SELECT id, product_id, url, order_position as 'order', created_at
    FROM product_images
    WHERE product_id = ?
    ORDER BY order_position ASC
  `);
    return stmt.all(productId);
}
// Get all products with their images
function getAllProducts(options) {
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
    const stmt = db_1.default.prepare(query);
    const rows = stmt.all(...params);
    return rows.map(row => {
        const product = rowToProduct(row);
        product.images = getProductImages(product.id);
        return product;
    });
}
// Get product by ID with images
function getProductById(id) {
    const stmt = db_1.default.prepare('SELECT * FROM products WHERE id = ?');
    const row = stmt.get(id);
    if (!row)
        return undefined;
    const product = rowToProduct(row);
    product.images = getProductImages(product.id);
    return product;
}
// Create a new product
function createProduct(input) {
    const id = (0, crypto_1.randomUUID)();
    const now = new Date().toISOString();
    const stmt = db_1.default.prepare(`
    INSERT INTO products (
      id, name, description, price, stock,
      is_featured, is_enquiry_only, category_id,
      created_at, updated_at
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);
    stmt.run(id, input.name, input.description || null, input.price || 0, input.stock || 0, input.isFeatured ? 1 : 0, input.isEnquiryOnly ? 1 : 0, input.category || null, now, now);
    // Add images if provided
    if (input.images && input.images.length > 0) {
        const imageStmt = db_1.default.prepare(`
      INSERT INTO product_images (id, product_id, url, order_position, created_at)
      VALUES (?, ?, ?, ?, ?)
    `);
        for (const img of input.images) {
            imageStmt.run((0, crypto_1.randomUUID)(), id, img.url, img.order, now);
        }
    }
    const product = getProductById(id);
    if (!product)
        throw new Error('Failed to create product');
    return product;
}
// Update a product
function updateProduct(input) {
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
    updates.push('updated_at = ?');
    values.push(new Date().toISOString());
    if (updates.length > 1) { // More than just updated_at
        values.push(input.id);
        const stmt = db_1.default.prepare(`UPDATE products SET ${updates.join(', ')} WHERE id = ?`);
        stmt.run(...values);
    }
    // Update images if provided
    if (input.images !== undefined) {
        // Delete existing images
        const deleteStmt = db_1.default.prepare('DELETE FROM product_images WHERE product_id = ?');
        deleteStmt.run(input.id);
        // Insert new images
        if (input.images.length > 0) {
            const imageStmt = db_1.default.prepare(`
        INSERT INTO product_images (id, product_id, url, order_position, created_at)
        VALUES (?, ?, ?, ?, ?)
      `);
            for (const img of input.images) {
                imageStmt.run((0, crypto_1.randomUUID)(), input.id, img.url, img.order, new Date().toISOString());
            }
        }
    }
    return getProductById(input.id);
}
// Delete a product
function deleteProduct(id) {
    const stmt = db_1.default.prepare('DELETE FROM products WHERE id = ?');
    const result = stmt.run(id);
    return result.changes > 0;
}
// Get products by category
function getProductsByCategory(categoryId) {
    return getAllProducts({ category: categoryId });
}
