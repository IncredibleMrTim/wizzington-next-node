import { Suspense } from "react";
import { getCachedProducts, getFeaturedProductCount } from "./actions";
import { Separator } from "./components/separator/Separator";
import { ProductCardSkeleton } from "@/components/products/productCard/ProductCardSkeleton";
import { ProductsGrid } from "@/components/products/ProductsGrid";

async function ProductsSection() {
  const products = await getCachedProducts();

  return (
    <div className="flex flex-row flex-wrap justify-between mt-2">
      {products?.some((p) => p.isFeatured) ? (
        <ProductsGrid products={products} />
      ) : (
        <p className="flex justify-center w-full mt-12">
          No products are available at the moment. Please check back soon!
        </p>
      )}
    </div>
  );
}

function ProductsSkeleton({ count }: { count: number }) {
  return (
    <div className="flex flex-row flex-wrap justify-between mt-2">
      {Array.from({ length: count }).map((_, i) => (
        <ProductCardSkeleton key={i} />
      ))}
    </div>
  );
}

export default async function App() {
  const productCount = await getFeaturedProductCount();

  return (
    <main>
      <div className="flex flex-col">
        <Separator />
        <p className="md:px-48 text-black opacity-80 w-full text-center p-6">
          Costumes that transform every performance into an unforgettable
          spectacle, embracing individuality and artistry.
        </p>
        <Separator />

        <Suspense fallback={<ProductsSkeleton count={productCount} />}>
          <ProductsSection />
        </Suspense>
      </div>
    </main>
  );
}
