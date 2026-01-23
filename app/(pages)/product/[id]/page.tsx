import { ProductDetailsSection } from "@/components/productDetails/ProductDetailsServer";
import { getCachedProducts } from "@/app/actions";

export const revalidate = 3600;
export const dynamicParams = true;

interface ProductPageProps {
  params: Promise<{
    id: string;
  }>;
}

export const generateStaticParams = async () => {
  const products = await getCachedProducts();
  return products.map((p) => ({ id: p.id }));
};

export default async function ProductPage({
  params: paramsPromise,
}: ProductPageProps) {
  const params = await paramsPromise;

  return <ProductDetailsSection id={params.id} />;
}
