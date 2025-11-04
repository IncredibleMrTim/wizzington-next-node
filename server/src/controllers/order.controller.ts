import { Request, Response } from 'express';
import {
  getAllOrders,
  getOrderById,
  createOrder,
  updateOrder,
  deleteOrder
} from '../models/order.model';
import { CreateOrderInput, UpdateOrderInput } from '../types';

export async function getAll(req: Request, res: Response) {
  try {
    const orders = getAllOrders();
    res.json(orders);
  } catch (error) {
    console.error('Error fetching orders:', error);
    res.status(500).json({ error: 'Failed to fetch orders' });
  }
}

export async function getById(req: Request, res: Response) {
  try {
    const id = req.params.id;
    const order = getOrderById(id);

    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }

    res.json(order);
  } catch (error) {
    console.error('Error fetching order:', error);
    res.status(500).json({ error: 'Failed to fetch order' });
  }
}

export async function create(req: Request, res: Response) {
  try {
    const input: CreateOrderInput = req.body;

    if (!input.products || input.products.length === 0) {
      return res.status(400).json({ error: 'Order must have at least one product' });
    }

    const order = createOrder(input);
    res.status(201).json(order);
  } catch (error) {
    console.error('Error creating order:', error);
    res.status(500).json({ error: 'Failed to create order' });
  }
}

export async function update(req: Request, res: Response) {
  try {
    const id = req.params.id;
    const input: UpdateOrderInput = { ...req.body, id };

    const order = updateOrder(input);

    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }

    res.json(order);
  } catch (error) {
    console.error('Error updating order:', error);
    res.status(500).json({ error: 'Failed to update order' });
  }
}

export async function remove(req: Request, res: Response) {
  try {
    const id = req.params.id;
    const success = deleteOrder(id);

    if (!success) {
      return res.status(404).json({ error: 'Order not found' });
    }

    res.status(204).send();
  } catch (error) {
    console.error('Error deleting order:', error);
    res.status(500).json({ error: 'Failed to delete order' });
  }
}
