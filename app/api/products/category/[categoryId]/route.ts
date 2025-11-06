import { NextRequest, NextResponse } from 'next/server';
import pool from '@/lib/db';
import { Product, ProductImage } from '@/lib/types';
import { RowDataPacket } from 'mysql2';

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

// GET /api/products/category/[categoryId] - Get products by category
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ categoryId: string }> }
) {
  try {
    const { categoryId } = await params;
    const [rows] = await pool.query<RowDataPacket[]>(
      'SELECT * FROM products WHERE category_id = ? ORDER BY created_at DESC',
      [categoryId]
    );

    const products = await Promise.all(
      rows.map(async (row) => {
        const product = rowToProduct(row);
        product.images = await getProductImages(product.id);
        return product;
      })
    );

    return NextResponse.json(products);
  } catch (error) {
    console.error('Error fetching products by category:', error);
    return NextResponse.json({ error: 'Failed to fetch products by category' }, { status: 500 });
  }
}
