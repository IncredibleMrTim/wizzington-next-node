import { ProductsGrid } from "./ProductsGrid";
import { ProductDTO } from "@/lib/types";

export const ProductsSection = async ({
  products,
}: {
  products: ProductDTO[];
}) => {
  console.log(products);
  return (
    <div className="flex flex-row flex-wrap justify-center md:justify-between mt-2">
      {products?.some((p) => p.isFeatured) ? (
        <ProductsGrid products={products} />
      ) : (
        <p className="flex justify-center w-full mt-12">
          No products are available at the moment. Please check back soon!
        </p>
      )}
    </div>
  );
};
