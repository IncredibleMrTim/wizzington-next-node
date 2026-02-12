import { Suspense } from "react";
import { getCachedProducts, getFeaturedProductCount } from "./actions";
import { ProductsSkeleton } from "./components/products/ProductsSkeleton";
import { ProductsSection } from "./components/products/ProductsSection";

export default async function App() {
  const products = await getCachedProducts();
  const productCount = await getFeaturedProductCount();

  return (
    <main>
      <div className="flex flex-col">
        <div className="flex flex-col items-center gap-6"></div>
        <Suspense fallback={<ProductsSkeleton count={productCount} />}>
          <ProductsSection products={products} />
        </Suspense>
      </div>
    </main>
  );
}
