import { NextRequest, NextResponse } from 'next/server';
import pool from '@/lib/db';
import { Product, UpdateProductInput, ProductImage } from '@/lib/types';
import { RowDataPacket, ResultSetHeader } from 'mysql2';
import { randomUUID } from 'crypto';

async function getProductImages(productId: string): Promise<ProductImage[]> {
  const [rows] = await pool.query<RowDataPacket[]>(
    `SELECT id, product_id, url, order_position as 'order', created_at
     FROM product_images
     WHERE product_id = ?
     ORDER BY order_position ASC`,
    [productId]
  );
  return rows as ProductImage[];
}

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

// GET /api/products/[id] - Get a single product
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const [rows] = await pool.query<RowDataPacket[]>('SELECT * FROM products WHERE id = ?', [id]);

    if (rows.length === 0) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 });
    }

    const product = rowToProduct(rows[0]);
    product.images = await getProductImages(product.id);

    return NextResponse.json(product);
  } catch (error) {
    console.error('Error fetching product:', error);
    return NextResponse.json({ error: 'Failed to fetch product' }, { status: 500 });
  }
}

// PUT /api/products/[id] - Update a product
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const input: UpdateProductInput = { ...await request.json(), id };

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

    if (updates.length > 0) {
      values.push(id);
      await pool.query<ResultSetHeader>(
        `UPDATE products SET ${updates.join(', ')} WHERE id = ?`,
        values
      );
    }

    if (input.images !== undefined) {
      await pool.query<ResultSetHeader>('DELETE FROM product_images WHERE product_id = ?', [id]);

      if (input.images.length > 0) {
        const imageValues = input.images.map(img => [
          randomUUID(),
          id,
          img.url,
          img.order
        ]);

        await pool.query<ResultSetHeader>(
          `INSERT INTO product_images (id, product_id, url, order_position) VALUES ?`,
          [imageValues]
        );
      }
    }

    const [rows] = await pool.query<RowDataPacket[]>('SELECT * FROM products WHERE id = ?', [id]);

    if (rows.length === 0) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 });
    }

    const product = rowToProduct(rows[0]);
    product.images = await getProductImages(product.id);

    return NextResponse.json(product);
  } catch (error) {
    console.error('Error updating product:', error);
    return NextResponse.json({ error: 'Failed to update product' }, { status: 500 });
  }
}

// DELETE /api/products/[id] - Delete a product
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const [result] = await pool.query<ResultSetHeader>('DELETE FROM products WHERE id = ?', [id]);

    if (result.affectedRows === 0) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 });
    }

    return new NextResponse(null, { status: 204 });
  } catch (error) {
    console.error('Error deleting product:', error);
    return NextResponse.json({ error: 'Failed to delete product' }, { status: 500 });
  }
}
