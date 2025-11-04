"use client";
import { useQuery } from "@tanstack/react-query";
import { Category, Product } from "@/lib/types";
import { API_BASE_URL } from "@/lib/api";
import { ProductQueryKeys } from "./keys";

export const useGetProductCategoriesQuery = () => {
  const getProductCategories = () =>
    useQuery({
      queryKey: [ProductQueryKeys.GET_PRODUCT_CATEGORIES],
      queryFn: async () => {
        const response = await fetch(`${API_BASE_URL}/categories`);

        if (!response.ok) {
          throw new Error('Failed to fetch categories');
        }

        return response.json() as Promise<Category[]>;
      },
    });

  const getProductsByCategoryId = (id: string) =>
    useQuery({
      queryKey: [ProductQueryKeys.GET_PRODUCTS_BY_CATEGORY, id],
      queryFn: async () => {
        const response = await fetch(`${API_BASE_URL}/products?category=${id}`);

        if (!response.ok) {
          throw new Error('Failed to fetch products by category');
        }

        return response.json() as Promise<Product[]>;
      },
      enabled: !!id,
    });

  return {
    getProductCategories,
    getProductsByCategoryId,
  };
};
