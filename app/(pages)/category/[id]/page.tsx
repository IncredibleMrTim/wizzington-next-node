import { getProductsByCategoryId } from "@/app/actions";
import { getCategoryById } from "@/app/actions/categories.action";
import { ProductsSection } from "@/app/components/products/ProductsSection";
import { ProductsSkeleton } from "@/app/components/products/ProductsSkeleton";
import { Footer } from "@/app/components/footer/Footer";
import { Suspense } from "react";

interface CategoryPageProps {
  params: Promise<{
    id: string;
  }>;
}

const CategoryPage = async ({ params: paramsPromise }: CategoryPageProps) => {
  const params = await paramsPromise;

  const category = await getCategoryById(params.id);
  const products = await getProductsByCategoryId(params.id);
  console.log(products.length);
  return (
    <main className="wm-scope -m-4 md:-mx-16 md:-my-8 p-4 md:px-16 md:py-8 min-h-screen flex flex-col bg-[color:var(--wm-plum)]">
      <div className="flex flex-col grow">
        <div className="flex flex-col items-center gap-2 pb-6">
          <h1
            className="wm-h-page italic"
            style={{ fontFamily: "var(--font-wm-display)", color: "var(--wm-cream)" }}
          >
            {category?.name}
          </h1>
        </div>
        {/* <Suspense fallback={<ProductsSkeleton count={productCount} />}> */}
        <ProductsSection products={products} />
        {/* </Suspense> */}
      </div>
      <Footer />
    </main>
  );
};

export default CategoryPage;
