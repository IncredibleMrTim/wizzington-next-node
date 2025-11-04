"use client";
import { Category, UpdateCategoryInput } from "@/lib/types";
import { useMutation, UseMutationResult } from "@tanstack/react-query";
import { API_BASE_URL } from "@/lib/api";
import { ProductMutationKeys } from "./keys";

export const useUpdateProductCategoryMutation = (): UseMutationResult<
  Category,
  unknown,
  UpdateCategoryInput
> => {
  const updateProductCategory = async (category: UpdateCategoryInput) => {
    if (!category.id) {
      throw new Error("Category id is required for update.");
    }

    const response = await fetch(`${API_BASE_URL}/categories/${category.id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(category),
    });

    if (!response.ok) {
      throw new Error('Failed to update category');
    }

    return response.json() as Promise<Category>;
  };

  return useMutation({
    mutationKey: [ProductMutationKeys.UPDATE_PRODUCT_CATEGORY],
    mutationFn: (category: UpdateCategoryInput) => updateProductCategory(category),
  });
};
