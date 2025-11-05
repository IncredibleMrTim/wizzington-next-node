import pool from '../db';
import { Order, CreateOrderInput, UpdateOrderInput, OrderProduct } from '../types';
import { randomUUID } from 'crypto';
import { RowDataPacket, ResultSetHeader } from 'mysql2';

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

export async function getAllOrders(): Promise<Order[]> {
  const [rows] = await pool.query<RowDataPacket[]>('SELECT * FROM orders ORDER BY created_at DESC');

  const orders = await Promise.all(
    rows.map(async (row) => {
      const order = rowToOrder(row);
      order.products = await getOrderProducts(order.id);
      return order;
    })
  );

  return orders;
}

export async function getOrderById(id: string): Promise<Order | undefined> {
  const [rows] = await pool.query<RowDataPacket[]>('SELECT * FROM orders WHERE id = ?', [id]);

  if (rows.length === 0) return undefined;

  const order = rowToOrder(rows[0]);
  order.products = await getOrderProducts(order.id);
  return order;
}

export async function createOrder(input: CreateOrderInput): Promise<Order> {
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

  const order = await getOrderById(id);
  if (!order) throw new Error('Failed to create order');
  return order;
}

export async function updateOrder(input: UpdateOrderInput): Promise<Order | undefined> {
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
    values.push(input.id);
    await pool.query<ResultSetHeader>(
      `UPDATE orders SET ${updates.join(', ')} WHERE id = ?`,
      values
    );
  }

  if (input.products !== undefined) {
    await pool.query<ResultSetHeader>('DELETE FROM order_products WHERE order_id = ?', [input.id]);

    if (input.products.length > 0) {
      const productValues = input.products.map(product => [
        product.uid || randomUUID(),
        input.id,
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

  return getOrderById(input.id);
}

export async function deleteOrder(id: string): Promise<boolean> {
  const [result] = await pool.query<ResultSetHeader>('DELETE FROM orders WHERE id = ?', [id]);
  return result.affectedRows > 0;
}
