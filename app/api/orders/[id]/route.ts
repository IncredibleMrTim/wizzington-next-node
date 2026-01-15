import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { UpdateOrderInput } from '@/lib/types';

// GET /api/orders/[id] - Get a single order
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const order = await prisma.order.findUnique({
      where: { id },
      include: {
        orderProducts: {
          orderBy: {
            createdAt: 'asc',
          },
        },
      },
    });

    if (!order) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 });
    }

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

    const data: any = {};

    if (input.customer_name !== undefined) {
      data.customerName = input.customer_name;
    }

    if (input.customer_email !== undefined) {
      data.customerEmail = input.customer_email;
    }

    if (input.customer_phone !== undefined) {
      data.customerPhone = input.customer_phone;
    }

    if (input.status !== undefined) {
      data.status = input.status;
    }

    if (input.notes !== undefined) {
      data.notes = input.notes;
    }

    if (input.products !== undefined) {
      const totalAmount = input.products.reduce((sum, p) => sum + (p.price * p.quantity), 0);
      data.totalAmount = totalAmount;
      data.orderProducts = {
        deleteMany: {},
        create: input.products.map(product => ({
          productId: product.productId,
          productName: product.name,
          quantity: product.quantity,
          price: product.price,
        })),
      };
    }

    const order = await prisma.order.update({
      where: { id },
      data,
      include: {
        orderProducts: {
          orderBy: {
            createdAt: 'asc',
          },
        },
      },
    });

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
    await prisma.order.delete({
      where: { id },
    });

    return new NextResponse(null, { status: 204 });
  } catch (error) {
    console.error('Error deleting order:', error);
    return NextResponse.json({ error: 'Failed to delete order' }, { status: 500 });
  }
}
