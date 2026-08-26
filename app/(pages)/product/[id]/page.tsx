import type { Metadata } from "next";
import { ProductDetailsContainer } from "@/app/components/productDetails/ProductDetailsContainer";
import { getCachedProducts, getCachedProductById } from "@/actions";
import { getCategoryById } from "@/app/actions/categories.action";
import { SITE_URL, productJsonLd, breadcrumbJsonLd } from "@/lib/seo";

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

export const generateMetadata = async ({
  params: paramsPromise,
}: ProductPageProps): Promise<Metadata> => {
  const { id } = await paramsPromise;
  const product = await getCachedProductById(id);

  if (!product) {
    return { title: "Product not found" };
  }

  const description =
    product.description ?? `Shop ${product.name} at Wizzington Moo's Boutique.`;
  const image = product.images[0]?.url;

  return {
    title: product.name,
    description,
    alternates: {
      canonical: `/product/${product.id}`,
    },
    openGraph: {
      type: "website",
      title: product.name,
      description,
      url: `${SITE_URL}/product/${product.id}`,
      images: image ? [{ url: image }] : undefined,
    },
    twitter: {
      card: "summary_large_image",
      title: product.name,
      description,
      images: image ? [image] : undefined,
    },
  };
};

export default async function ProductPage({
  params: paramsPromise,
}: ProductPageProps) {
  const params = await paramsPromise;
  const product = await getCachedProductById(params.id);
  const category = product?.categoryId
    ? await getCategoryById(product.categoryId)
    : null;

  if (!product) {
    return <ProductDetailsContainer id={params.id} />;
  }

  const breadcrumbItems = [
    { name: "Home", url: SITE_URL },
    ...(category
      ? [{ name: category.name, url: `${SITE_URL}/category/${category.id}` }]
      : []),
    { name: product.name, url: `${SITE_URL}/product/${product.id}` },
  ];

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(productJsonLd(product, category?.name)),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(breadcrumbJsonLd(breadcrumbItems)),
        }}
      />
      <ProductDetailsContainer id={params.id} />
    </>
  );
}
