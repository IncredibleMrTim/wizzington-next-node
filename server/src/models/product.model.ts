import db from '../db';
import { Product, CreateProductInput, UpdateProductInput, ProductImage } from '../types';
import { randomUUID } from 'crypto';

// Helper function to convert database row to Product with images
function rowToProduct(row: any): Product {
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
function getProductImages(productId: string): ProductImage[] {
  const stmt = db.prepare(`
    SELECT id, product_id, url, order_position as 'order', created_at
    FROM product_images
    WHERE product_id = ?
    ORDER BY order_position ASC
  `);
  return stmt.all(productId) as ProductImage[];
}

// Get all products with their images
export function getAllProducts(options?: { isFeatured?: boolean; category?: string }): Product[] {
  let query = 'SELECT * FROM products WHERE 1=1';
  const params: any[] = [];

  if (options?.isFeatured !== undefined) {
    query += ' AND is_featured = ?';
    params.push(options.isFeatured ? 1 : 0);
  }

  if (options?.category) {
    query += ' AND category_id = ?';
    params.push(options.category);
  }

  query += ' ORDER BY created_at DESC';

  const stmt = db.prepare(query);
  const rows = stmt.all(...params) as any[];

  return rows.map(row => {
    const product = rowToProduct(row);
    product.images = getProductImages(product.id);
    return product;
  });
}

// Get product by ID with images
export function getProductById(id: string): Product | undefined {
  const stmt = db.prepare('SELECT * FROM products WHERE id = ?');
  const row = stmt.get(id) as any;

  if (!row) return undefined;

  const product = rowToProduct(row);
  product.images = getProductImages(product.id);
  return product;
}

// Create a new product
export function createProduct(input: CreateProductInput): Product {
  const id = randomUUID();
  const now = new Date().toISOString();

  const stmt = db.prepare(`
    INSERT INTO products (
      id, name, description, price, stock,
      is_featured, is_enquiry_only, category_id,
      created_at, updated_at
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);

  stmt.run(
    id,
    input.name,
    input.description || null,
    input.price || 0,
    input.stock || 0,
    input.isFeatured ? 1 : 0,
    input.isEnquiryOnly ? 1 : 0,
    input.category || null,
    now,
    now
  );

  // Add images if provided
  if (input.images && input.images.length > 0) {
    const imageStmt = db.prepare(`
      INSERT INTO product_images (id, product_id, url, order_position, created_at)
      VALUES (?, ?, ?, ?, ?)
    `);

    for (const img of input.images) {
      imageStmt.run(randomUUID(), id, img.url, img.order, now);
    }
  }

  const product = getProductById(id);
  if (!product) throw new Error('Failed to create product');
  return product;
}

// Update a product
export function updateProduct(input: UpdateProductInput): Product | undefined {
  const updates: string[] = [];
  const values: any[] = [];

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
    const stmt = db.prepare(`UPDATE products SET ${updates.join(', ')} WHERE id = ?`);
    stmt.run(...values);
  }

  // Update images if provided
  if (input.images !== undefined) {
    // Delete existing images
    const deleteStmt = db.prepare('DELETE FROM product_images WHERE product_id = ?');
    deleteStmt.run(input.id);

    // Insert new images
    if (input.images.length > 0) {
      const imageStmt = db.prepare(`
        INSERT INTO product_images (id, product_id, url, order_position, created_at)
        VALUES (?, ?, ?, ?, ?)
      `);

      for (const img of input.images) {
        imageStmt.run(randomUUID(), input.id, img.url, img.order, new Date().toISOString());
      }
    }
  }

  return getProductById(input.id);
}

// Delete a product
export function deleteProduct(id: string): boolean {
  const stmt = db.prepare('DELETE FROM products WHERE id = ?');
  const result = stmt.run(id);
  return result.changes > 0;
}

// Get products by category
export function getProductsByCategory(categoryId: string): Product[] {
  return getAllProducts({ category: categoryId });
}
