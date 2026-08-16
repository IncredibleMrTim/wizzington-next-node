import { Suspense } from "react";
import { getCachedProducts, getFeaturedProductCount } from "./actions";
import { ProductsSkeleton } from "./components/products/ProductsSkeleton";
import { ProductsSection } from "./components/products/ProductsSection";
import { Footer } from "./components/footer/Footer";

export default async function App() {
  const products = await getCachedProducts();
  const productCount = await getFeaturedProductCount();

  return (
    <main className="wm-scope -m-4 md:-mx-16 md:-my-8 p-4 md:px-16 md:py-8 min-h-screen flex flex-col bg-[color:var(--wm-plum)]">
      <div className="flex flex-col grow">
        <div className="flex flex-col items-center gap-6"></div>
        <Suspense fallback={<ProductsSkeleton count={productCount} />}>
          <ProductsSection products={products} />
        </Suspense>
      </div>
      <Footer />
    </main>
  );
}
