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
        <div key={product.id} className="w-full md:w-1/2 lg:w-1/4">
          <ProductCard
            showDescription={false}
            key={product.id}
            product={product}
          />
        </div>
      ))}
    </>
  );
};
