"use client";
import { Product, CreateProductInput } from "@/lib/types";
import { useMutation, UseMutationResult } from "@tanstack/react-query";
import { API_BASE_URL } from "@/lib/api";
import { ProductMutationKeys } from "./keys";

export const useAddProductMutation = (): UseMutationResult<
  Product | null,
  unknown,
  CreateProductInput
> => {
  const addProduct = async (product: CreateProductInput) => {
    try {
      const response = await fetch(`${API_BASE_URL}/products`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(product),
      });

      if (!response.ok) {
        throw new Error('Failed to create product');
      }

      return response.json() as Promise<Product>;
    } catch (error) {
      console.error("Error creating product:", error);
      throw new Error(`Failed to create product: ${error}`);
    }
  };

  return useMutation({
    mutationKey: [ProductMutationKeys.CREATE_PRODUCT],
    mutationFn: (product: CreateProductInput) => addProduct(product),
  });
};
