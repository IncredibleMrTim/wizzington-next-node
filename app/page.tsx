"use client";

import { startTransition, useEffect, useState } from "react";
import ProductCard from "@/components/products/productCard/ProductCard";
import { ProductDTO } from "@/lib/types";
import { getProducts } from "./actions";
import { Separator } from "./components/separator/Separator";

export default function App() {
  const [products, setProducts] = useState<ProductDTO[] | null>(null);

  useEffect(() => {
    if (products) return;
    startTransition(async () => {
      const data = await getProducts();
      setProducts(data);
    });
  }, [products]);

  return (
    <main>
      <div className="flex flex-col">
        <Separator />
        <p className="md:px-48 text-black opacity-80 w-full text-center p-6">
          Costumes that transform every performance into an unforgettable
          spectacle, embracing individuality and artistry.
        </p>
        <Separator />

        <div className="flex flex-row flex-wrap justify-between mt-2">
          {products?.some((p) => p.isFeatured) ? (
            products
              ?.filter((p) => p?.isFeatured ?? false)
              ?.map((product) => (
                <ProductCard
                  showDescription={false}
                  key={product.id}
                  product={product}
                />
              ))
          ) : (
            <p className="flex justify-center w-full mt-12">
              No products are available at the moment. Please check back soon!
            </p>
          )}
        </div>
      </div>
    </main>
  );
}
