"use client";
import { useQuery } from "@tanstack/react-query";
import { Product } from "@/lib/types";
import { API_BASE_URL } from "@/lib/api";
import { ProductQueryKeys } from "./keys";

export const useGetProductsQuery = () => {
  const fetchProducts = async (count?: number, isFeatured?: boolean) => {
    const params = new URLSearchParams();
    if (isFeatured !== undefined) {
      params.append("isFeatured", String(isFeatured));
    }

    const url = `${API_BASE_URL}/products${
      params.toString() ? `?${params.toString()}` : ""
    }`;
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error("Failed to fetch products");
    }

    return response.json() as Promise<Product[]>;
  };

  return useQuery({
    queryKey: [ProductQueryKeys.GET_PRODUCTS],
    queryFn: async () => {
      return await fetchProducts();
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
};
