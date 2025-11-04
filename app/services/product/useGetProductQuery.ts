"use client";
import { useQuery } from "@tanstack/react-query";
import { Product } from "@/lib/types";
import { API_BASE_URL } from "@/lib/api";
import { ProductQueryKeys } from "./keys";

export const useGetProductQuery = () => {
  const fetchProductById = async (id: string): Promise<Product | null> => {
    const response = await fetch(`${API_BASE_URL}/products/${id}`);

    if (!response.ok) {
      if (response.status === 404) return null;
      throw new Error('Failed to fetch product');
    }

    return response.json();
  };

  const fetchProductByName = async (name: string): Promise<Product | null> => {
    const response = await fetch(`${API_BASE_URL}/products`);

    if (!response.ok) {
      throw new Error('Failed to fetch products');
    }

    const products: Product[] = await response.json();
    const normalizedName = name.replace(/-/g, " ");
    return products.find(p => p.name.toLowerCase() === normalizedName.toLowerCase()) || null;
  };

  const getProductById = ({
    id,
    enabled,
  }: {
    id: string;
    enabled: boolean;
  }) => {
    return useQuery({
      queryKey: [ProductQueryKeys.GET_PRODUCT, id],
      queryFn: async () => {
        return await fetchProductById(id);
      },
      staleTime: 0,
      enabled,
    });
  };

  const getProductByName = (name: string) =>
    useQuery({
      queryKey: [ProductQueryKeys.GET_PRODUCT, name],
      queryFn: async () => {
        return await fetchProductByName(name);
      },
      enabled: !!name,
    });

  return {
    getProductById,
    getProductByName,
  };
};
