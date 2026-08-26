"use server";

import prisma from "@/lib/prisma";
import { CreateOrderInput } from "@/lib/types";

export const createOrder = async (input: CreateOrderInput) => {
  const totalAmount = input.products.reduce(
    (sum, product) => sum + product.price * product.quantity,
    0,
  );

  const order = await prisma.order.create({
    data: {
      customerName: input.customer_name,
      customerEmail: input.customer_email,
      customerPhone: input.customer_phone,
      notes: input.notes,
      status: input.status || "PENDING",
      totalAmount,
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

  return {
    ...order,
    totalAmount: Number(order.totalAmount),
    orderProducts: order.orderProducts.map((product) => ({
      ...product,
      price: Number(product.price),
    })),
  };
};
