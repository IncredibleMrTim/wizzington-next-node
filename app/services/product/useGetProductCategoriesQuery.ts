"use client";
import { useQuery } from "@tanstack/react-query";
import { Category } from "@/lib/types";
import { API_BASE_URL } from "@/lib/api";
import { ProductQueryKeys } from "./keys";

export const useGetProductCategoriesQuery = () => {
  return useQuery({
    queryKey: [ProductQueryKeys.GET_PRODUCT_CATEGORIES],
    queryFn: async () => {
      const response = await fetch(`${API_BASE_URL}/categories`);

      if (!response.ok) {
        throw new Error('Failed to fetch categories');
      }

      return response.json() as Promise<Category[]>;
    },
  });
};
