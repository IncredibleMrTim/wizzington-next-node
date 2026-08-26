import type { MetadataRoute } from "next";
import { getCachedProducts } from "@/actions";
import { getCategories, CategoryWithChildren } from "@/app/actions/categories.action";
import { SITE_URL } from "@/lib/seo";

const flattenCategories = (
  categories: CategoryWithChildren[],
): CategoryWithChildren[] =>
  categories.flatMap((category) => [category, ...flattenCategories(category.children)]);

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [products, categories] = await Promise.all([
    getCachedProducts(),
    getCategories(),
  ]);

  const productEntries: MetadataRoute.Sitemap = products.map((product) => ({
    url: `${SITE_URL}/product/${product.id}`,
    lastModified: product.updatedAt,
    changeFrequency: "weekly",
    priority: 0.8,
  }));

  const categoryEntries: MetadataRoute.Sitemap = flattenCategories(categories).map(
    (category) => ({
      url: `${SITE_URL}/category/${category.id}`,
      changeFrequency: "weekly",
      priority: 0.7,
    }),
  );

  return [
    {
      url: SITE_URL,
      changeFrequency: "daily",
      priority: 1,
    },
    ...categoryEntries,
    ...productEntries,
  ];
}
