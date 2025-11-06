import { NextRequest, NextResponse } from 'next/server';
import pool from '@/lib/db';
import { Order, CreateOrderInput, OrderProduct } from '@/lib/types';
import { RowDataPacket, ResultSetHeader } from 'mysql2';
import { randomUUID } from 'crypto';

function rowToOrder(row: any): Order {
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

async function getOrderProducts(orderId: string): Promise<OrderProduct[]> {
  const [rows] = await pool.query<RowDataPacket[]>(
    `SELECT id, order_id, product_id as productId, product_name as name, quantity, price, created_at
     FROM order_products
     WHERE order_id = ?
     ORDER BY created_at ASC`,
    [orderId]
  );
  return rows.map(p => ({ ...p, uid: p.id })) as OrderProduct[];
}

// GET /api/orders - Get all orders
export async function GET() {
  try {
    const [rows] = await pool.query<RowDataPacket[]>('SELECT * FROM orders ORDER BY created_at DESC');

    const orders = await Promise.all(
      rows.map(async (row) => {
        const order = rowToOrder(row);
        order.products = await getOrderProducts(order.id);
        return order;
      })
    );

    return NextResponse.json(orders);
  } catch (error) {
    console.error('Error fetching orders:', error);
    return NextResponse.json({ error: 'Failed to fetch orders' }, { status: 500 });
  }
}

// POST /api/orders - Create a new order
export async function POST(request: NextRequest) {
  try {
    const input: CreateOrderInput = await request.json();

    if (!input.products || input.products.length === 0) {
      return NextResponse.json({ error: 'Products are required' }, { status: 400 });
    }

    const id = randomUUID();
    const totalAmount = input.products.reduce((sum, p) => sum + (p.price * p.quantity), 0);

    await pool.query<ResultSetHeader>(
      `INSERT INTO orders (
        id, customer_name, customer_email, customer_phone,
        status, total_amount, notes
      ) VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [
        id,
        input.customer_name || null,
        input.customer_email || null,
        input.customer_phone || null,
        'pending',
        totalAmount,
        input.notes || null
      ]
    );

    if (input.products && input.products.length > 0) {
      const productValues = input.products.map(product => [
        randomUUID(),
        id,
        product.productId,
        product.name,
        product.quantity,
        product.price
      ]);

      await pool.query<ResultSetHeader>(
        `INSERT INTO order_products (id, order_id, product_id, product_name, quantity, price) VALUES ?`,
        [productValues]
      );
    }

    const [rows] = await pool.query<RowDataPacket[]>('SELECT * FROM orders WHERE id = ?', [id]);
    const order = rowToOrder(rows[0]);
    order.products = await getOrderProducts(order.id);

    return NextResponse.json(order, { status: 201 });
  } catch (error) {
    console.error('Error creating order:', error);
    return NextResponse.json({ error: 'Failed to create order' }, { status: 500 });
  }
}
