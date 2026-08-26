import type { Metadata } from "next";
import { getProductsByCategoryId } from "@/app/actions";
import { getCategoryById } from "@/app/actions/categories.action";
import { ProductsSection } from "@/app/components/products/ProductsSection";
import { ProductsSkeleton } from "@/app/components/products/ProductsSkeleton";
import { Footer } from "@/app/components/footer/Footer";
import { Suspense } from "react";
import { SITE_URL, breadcrumbJsonLd } from "@/lib/seo";

interface CategoryPageProps {
  params: Promise<{
    id: string;
  }>;
}

export const generateMetadata = async ({
  params: paramsPromise,
}: CategoryPageProps): Promise<Metadata> => {
  const { id } = await paramsPromise;
  const category = await getCategoryById(id);

  if (!category) {
    return { title: "Category not found" };
  }

  const description =
    category.description ??
    `Shop ${category.name} at Wizzington Moo's Boutique — dancewear & pageant couture, shipped worldwide.`;

  return {
    title: category.name,
    description,
    alternates: {
      canonical: `/category/${category.id}`,
    },
    openGraph: {
      type: "website",
      title: category.name,
      description,
      url: `${SITE_URL}/category/${category.id}`,
    },
  };
};

const CategoryPage = async ({ params: paramsPromise }: CategoryPageProps) => {
  const params = await paramsPromise;

  const category = await getCategoryById(params.id);
  const products = await getProductsByCategoryId(params.id);

  const breadcrumbItems = [
    { name: "Home", url: SITE_URL },
    ...(category
      ? [{ name: category.name, url: `${SITE_URL}/category/${category.id}` }]
      : []),
  ];

  return (
    <main className="-m-4 md:-mx-16 md:-my-8 p-4 md:px-16 md:py-8 min-h-screen flex flex-col bg-brand-plum">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(breadcrumbJsonLd(breadcrumbItems)),
        }}
      />
      <div className="flex flex-col grow">
        <div className="flex flex-col items-center gap-2 pb-6">
          <h1
            className="wm-h-page italic"
            style={{ color: "var(--color-brand-cream)" }}
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
