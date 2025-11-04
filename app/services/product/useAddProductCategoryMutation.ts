"use client";
import { Category, CreateCategoryInput } from "@/lib/types";
import { useMutation, UseMutationResult } from "@tanstack/react-query";
import { API_BASE_URL } from "@/lib/api";
import { ProductMutationKeys } from "./keys";

export const useAddProductCategoryMutation = (): UseMutationResult<
  Category | null,
  unknown,
  CreateCategoryInput
> => {
  const addProductCategory = async (category: CreateCategoryInput) => {
    try {
      const response = await fetch(`${API_BASE_URL}/categories`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(category),
      });

      if (!response.ok) {
        throw new Error('Failed to create category');
      }

      return response.json() as Promise<Category>;
    } catch (error) {
      console.error("Error creating category:", error);
      throw new Error(`Failed to create category: ${error}`);
    }
  };

  return useMutation({
    mutationKey: [ProductMutationKeys.CREATE_PRODUCT_CATEGORY],
    mutationFn: (category: CreateCategoryInput) => addProductCategory(category),
  });
};
