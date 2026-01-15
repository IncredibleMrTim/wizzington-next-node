import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { UpdateProductInput } from '@/lib/types';

// GET /api/products/[id] - Get a single product
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const product = await prisma.product.findUnique({
      where: { id },
      include: {
        images: {
          orderBy: {
            orderPosition: 'asc',
          },
        },
      },
    });

    if (!product) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 });
    }

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

    const data: any = {};

    if (input.name !== undefined) {
      data.name = input.name;
    }

    if (input.description !== undefined) {
      data.description = input.description;
    }

    if (input.price !== undefined) {
      data.price = input.price;
    }

    if (input.stock !== undefined) {
      data.stock = input.stock;
    }

    if (input.isFeatured !== undefined) {
      data.isFeatured = input.isFeatured;
    }

    if (input.isEnquiryOnly !== undefined) {
      data.isEnquiryOnly = input.isEnquiryOnly;
    }

    if (input.category !== undefined) {
      data.categoryId = input.category;
    }

    if (input.images !== undefined) {
      data.images = {
        deleteMany: {},
        create: input.images.map(img => ({
          url: img.url,
          orderPosition: img.order,
        })),
      };
    }

    const product = await prisma.product.update({
      where: { id },
      data,
      include: {
        images: {
          orderBy: {
            orderPosition: 'asc',
          },
        },
      },
    });

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
    await prisma.product.delete({
      where: { id },
    });

    return new NextResponse(null, { status: 204 });
  } catch (error) {
    console.error('Error deleting product:', error);
    return NextResponse.json({ error: 'Failed to delete product' }, { status: 500 });
  }
}
