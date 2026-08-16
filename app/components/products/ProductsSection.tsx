import { ProductsGrid } from "./ProductsGrid";
import { ProductDTO } from "@/lib/types";

export const ProductsSection = async ({
  products,
}: {
  products: ProductDTO[];
}) => {
  console.log(products);
  return (
    <div className="wm-scope flex flex-row flex-wrap justify-center md:justify-between gap-4 mt-2">
      {products?.some((p) => p.isFeatured) ? (
        <ProductsGrid products={products} />
      ) : (
        <div
          className="flex justify-center w-full mt-12 text-sm"
          style={{ color: "rgba(245,237,232,0.5)", fontFamily: "var(--font-wm-body)" }}
        >
          No products are available at the moment. Please check back soon!
        </div>
      )}
    </div>
  );
};
