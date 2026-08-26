"use client"

import { OrderProduct } from "@prisma/client"

// Derives the basket total from the order's line items, rather than
// accumulating deltas, so it stays correct no matter how many times or
// in what order add/update/remove actions fire for the same product.
export const calculateTotalCost = (orderProducts: OrderProduct[]) =>
  orderProducts.reduce(
    (sum, product) => sum + Number(product.price) * (product.quantity || 1),
    0,
  )
