"use client";
import { Product, UpdateProductInput } from "@/lib/types";
import { useMutation, UseMutationResult } from "@tanstack/react-query";
import { API_BASE_URL } from "@/lib/api";
import { ProductMutationKeys } from "./keys";

export const useUpdateProductMutation = (): UseMutationResult<
  Product,
  unknown,
  UpdateProductInput
> => {
  const updateProduct = async (product: UpdateProductInput) => {
    if (!product.id) {
      throw new Error("Product id is required for update.");
    }

    const response = await fetch(`${API_BASE_URL}/products/${product.id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(product),
    });

    if (!response.ok) {
      throw new Error('Failed to update product');
    }

    return response.json() as Promise<Product>;
  };

  return useMutation({
    mutationKey: [ProductMutationKeys.UPDATE_PRODUCT],
    mutationFn: (product: UpdateProductInput) => updateProduct(product),
  });
};
