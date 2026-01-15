import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { CreateOrderInput } from '@/lib/types';

// GET /api/orders - Get all orders
export async function GET() {
  try {
    const orders = await prisma.order.findMany({
      include: {
        orderProducts: {
          orderBy: {
            createdAt: 'asc',
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

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

    const totalAmount = input.products.reduce((sum, p) => sum + (p.price * p.quantity), 0);

    const order = await prisma.order.create({
      data: {
        customerName: input.customer_name || null,
        customerEmail: input.customer_email || null,
        customerPhone: input.customer_phone || null,
        status: 'pending',
        totalAmount,
        notes: input.notes || null,
        orderProducts: {
          create: input.products.map(product => ({
            productId: product.productId,
            productName: product.name,
            quantity: product.quantity,
            price: product.price,
          })),
        },
      },
      include: {
        orderProducts: {
          orderBy: {
            createdAt: 'asc',
          },
        },
      },
    });

    return NextResponse.json(order, { status: 201 });
  } catch (error) {
    console.error('Error creating order:', error);
    return NextResponse.json({ error: 'Failed to create order' }, { status: 500 });
  }
}
