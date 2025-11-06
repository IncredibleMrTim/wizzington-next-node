import { NextRequest, NextResponse } from 'next/server';
import pool from '@/lib/db';
import { Order, UpdateOrderInput, OrderProduct } from '@/lib/types';
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

// GET /api/orders/[id] - Get a single order
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const [rows] = await pool.query<RowDataPacket[]>('SELECT * FROM orders WHERE id = ?', [id]);

    if (rows.length === 0) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 });
    }

    const order = rowToOrder(rows[0]);
    order.products = await getOrderProducts(order.id);

    return NextResponse.json(order);
  } catch (error) {
    console.error('Error fetching order:', error);
    return NextResponse.json({ error: 'Failed to fetch order' }, { status: 500 });
  }
}

// PUT /api/orders/[id] - Update an order
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const input: UpdateOrderInput = { ...await request.json(), id };

    const updates: string[] = [];
    const values: any[] = [];

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
      values.push(id);
      await pool.query<ResultSetHeader>(
        `UPDATE orders SET ${updates.join(', ')} WHERE id = ?`,
        values
      );
    }

    if (input.products !== undefined) {
      await pool.query<ResultSetHeader>('DELETE FROM order_products WHERE order_id = ?', [id]);

      if (input.products.length > 0) {
        const productValues = input.products.map(product => [
          product.uid || randomUUID(),
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
    }

    const [rows] = await pool.query<RowDataPacket[]>('SELECT * FROM orders WHERE id = ?', [id]);

    if (rows.length === 0) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 });
    }

    const order = rowToOrder(rows[0]);
    order.products = await getOrderProducts(order.id);

    return NextResponse.json(order);
  } catch (error) {
    console.error('Error updating order:', error);
    return NextResponse.json({ error: 'Failed to update order' }, { status: 500 });
  }
}

// DELETE /api/orders/[id] - Delete an order
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const [result] = await pool.query<ResultSetHeader>('DELETE FROM orders WHERE id = ?', [id]);

    if (result.affectedRows === 0) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 });
    }

    return new NextResponse(null, { status: 204 });
  } catch (error) {
    console.error('Error deleting order:', error);
    return NextResponse.json({ error: 'Failed to delete order' }, { status: 500 });
  }
}
