import { NextRequest, NextResponse } from 'next/server';
import pool from '@/lib/db';
import { Product, CreateProductInput, ProductImage } from '@/lib/types';
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

// GET /api/products - Get all products
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const isFeatured = searchParams.get('isFeatured') === 'true' ? true : searchParams.get('isFeatured') === 'false' ? false : undefined;
    const category = searchParams.get('category') || undefined;

    let query = 'SELECT * FROM products WHERE 1=1';
    const params: any[] = [];

    if (isFeatured !== undefined) {
      query += ' AND is_featured = ?';
      params.push(isFeatured ? 1 : 0);
    }

    if (category) {
      query += ' AND category_id = ?';
      params.push(category);
    }

    query += ' ORDER BY created_at DESC';

    const [rows] = await pool.query<RowDataPacket[]>(query, params);

    const products = await Promise.all(
      rows.map(async (row) => {
        const product = rowToProduct(row);
        product.images = await getProductImages(product.id);
        return product;
      })
    );

    return NextResponse.json(products);
  } catch (error) {
    console.error('Error fetching products:', error);
    return NextResponse.json({ error: 'Failed to fetch products' }, { status: 500 });
  }
}

// POST /api/products - Create a new product
export async function POST(request: NextRequest) {
  try {
    const input: CreateProductInput = await request.json();

    if (!input.name) {
      return NextResponse.json({ error: 'Name is required' }, { status: 400 });
    }

    const id = randomUUID();

    await pool.query<ResultSetHeader>(
      `INSERT INTO products (
        id, name, description, price, stock,
        is_featured, is_enquiry_only, category_id
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        id,
        input.name,
        input.description || null,
        input.price || 0,
        input.stock || 0,
        input.isFeatured ? 1 : 0,
        input.isEnquiryOnly ? 1 : 0,
        input.category || null
      ]
    );

    if (input.images && input.images.length > 0) {
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

    const [rows] = await pool.query<RowDataPacket[]>('SELECT * FROM products WHERE id = ?', [id]);
    const product = rowToProduct(rows[0]);
    product.images = await getProductImages(product.id);

    return NextResponse.json(product, { status: 201 });
  } catch (error) {
    console.error('Error creating product:', error);
    return NextResponse.json({ error: 'Failed to create product' }, { status: 500 });
  }
}
