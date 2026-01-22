"use client";

import ProductCard from "./productCard/ProductCard";
import { ProductDTO } from "@/lib/types";

interface Props {
  products: ProductDTO[];
}

export const ProductsGrid = ({ products }: Props) => {
  const featuredProducts = products.filter((p) => p?.isFeatured ?? false);

  return (
    <>
      {featuredProducts.map((product) => (
        <ProductCard
          showDescription={false}
          key={product.id}
          product={product}
        />
      ))}
    </>
  );
};
