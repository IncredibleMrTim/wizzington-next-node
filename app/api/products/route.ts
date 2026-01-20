import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { CreateProductInput } from "@/lib/types";
import { getProducts } from "../../actions/product.actions";

// GET /api/products - Get all products
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const isFeatured =
      searchParams.get("isFeatured") === "true"
        ? true
        : searchParams.get("isFeatured") === "false"
        ? false
        : undefined;
    const categoryId = searchParams.get("category") || undefined;

    const products = await getProducts(isFeatured, categoryId);

    return NextResponse.json(products);
  } catch (error) {
    console.error("Error fetching products:", error);
    return NextResponse.json(
      { error: "Failed to fetch products" },
      { status: 500 }
    );
  }
}

// POST /api/products - Create a new product
export async function POST(request: NextRequest) {
  try {
    const input: CreateProductInput = await request.json();

    if (!input.name) {
      return NextResponse.json({ error: "Name is required" }, { status: 400 });
    }

    const product = await prisma.product.create({
      data: {
        name: input.name,
        description: input.description || null,
        price: input.price || 0,
        stock: input.stock || 0,
        isFeatured: input.isFeatured || false,
        isEnquiryOnly: input.isEnquiryOnly || false,
        categoryId: input.category || null,
        images:
          input.images && input.images.length > 0
            ? {
                create: input.images.map((img) => ({
                  url: img.url,
                  orderPosition: img.order,
                })),
              }
            : undefined,
      },
      include: {
        images: {
          orderBy: {
            orderPosition: "asc",
          },
        },
      },
    });

    return NextResponse.json(product, { status: 201 });
  } catch (error) {
    console.error("Error creating product:", error);
    return NextResponse.json(
      { error: "Failed to create product" },
      { status: 500 }
    );
  }
}
