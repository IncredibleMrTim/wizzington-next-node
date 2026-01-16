"use client";
import { useQuery } from "@tanstack/react-query";
import { Product } from "@/lib/types";
import { API_BASE_URL } from "@/lib/api";
import { ProductQueryKeys } from "./keys";

export const useGetProductsByCategoryQuery = (categoryId: string | undefined) => {
  return useQuery({
    queryKey: [ProductQueryKeys.GET_PRODUCTS_BY_CATEGORY, categoryId],
    queryFn: async () => {
      const response = await fetch(`${API_BASE_URL}/products?category=${categoryId}`);

      if (!response.ok) {
        throw new Error('Failed to fetch products by category');
      }

      return response.json() as Promise<Product[]>;
    },
    enabled: !!categoryId,
  });
};
