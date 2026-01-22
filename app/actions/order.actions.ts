"use server";

import prisma from "@/lib/prisma";
import { CreateOrderInput } from "@/lib/types";

export const createOrder = async (input: CreateOrderInput) => {
  const order = await prisma.order.create({
    data: {
      customerName: input.customer_name,
      customerEmail: input.customer_email,
      customerPhone: input.customer_phone,
      notes: input.notes,
      status: "PENDING",
      orderProducts: {
        create: input.products.map((product) => ({
          productId: product.productId,
          productName: product.name,
          quantity: product.quantity,
          price: product.price,
        })),
      },
    },
    include: {
      orderProducts: true,
    },
  });

  return order;
};
