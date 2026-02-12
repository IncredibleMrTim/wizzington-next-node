import { getProductsByCategoryId } from "@/app/actions";
import { getCategoryById } from "@/app/actions/categories.action";
import { ProductsSection } from "@/app/components/products/ProductsSection";
import { ProductsSkeleton } from "@/app/components/products/ProductsSkeleton";
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
    <main>
      <div className="flex flex-col">
        <div className="flex flex-col items-center gap-6"></div>
        {/* <Suspense fallback={<ProductsSkeleton count={productCount} />}> */}
        <ProductsSection products={products} />
        {/* </Suspense> */}
      </div>
    </main>
  );
};

export default CategoryPage;
