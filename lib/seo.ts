import type { ProductDTO } from "@/lib/types";

export const SITE_URL = (
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://wizzingtonmoosuk.com"
).replace(/\/$/, "");

export const SITE_NAME = "Wizzington Moo's Boutique";

export const BUSINESS = {
  name: SITE_NAME,
  telephone: "+447855383759",
  email: "info@wizzingtonmoosuk.com",
  addressLocality: "Park Gate",
  postalCode: "SO31",
  addressRegion: "Hampshire",
  addressCountry: "GB",
  sameAs: [
    "https://www.facebook.com/wizzington.moos.7",
    "https://www.tiktok.com/@wizzingtonmoosuk",
    "https://www.instagram.com/wizzingtonmoosboutique/",
  ],
};

/** Organization + LocalBusiness JSON-LD, rendered site-wide in the root layout */
export const organizationJsonLd = () => ({
  "@context": "https://schema.org",
  "@type": "ClothingStore",
  "@id": `${SITE_URL}/#organization`,
  name: BUSINESS.name,
  url: SITE_URL,
  logo: `${SITE_URL}/logo.webp`,
  image: `${SITE_URL}/logo.webp`,
  telephone: BUSINESS.telephone,
  email: BUSINESS.email,
  priceRange: "£££",
  areaServed: "Worldwide",
  address: {
    "@type": "PostalAddress",
    addressLocality: BUSINESS.addressLocality,
    postalCode: BUSINESS.postalCode,
    addressRegion: BUSINESS.addressRegion,
    addressCountry: BUSINESS.addressCountry,
  },
  sameAs: BUSINESS.sameAs,
});

/** Product JSON-LD for a single product detail page */
export const productJsonLd = (product: ProductDTO, categoryName?: string) => ({
  "@context": "https://schema.org",
  "@type": "Product",
  "@id": `${SITE_URL}/product/${product.id}#product`,
  name: product.name,
  description: product.description ?? undefined,
  sku: product.id,
  image: product.images.map((img) => img.url),
  category: categoryName,
  brand: {
    "@type": "Brand",
    name: SITE_NAME,
  },
  offers: {
    "@type": "Offer",
    url: `${SITE_URL}/product/${product.id}`,
    priceCurrency: "GBP",
    price: product.price,
    availability:
      product.stock > 0
        ? "https://schema.org/InStock"
        : "https://schema.org/OutOfStock",
    itemCondition: "https://schema.org/NewCondition",
    seller: {
      "@type": "Organization",
      name: SITE_NAME,
    },
  },
});

export interface BreadcrumbItem {
  name: string;
  url: string;
}

/** BreadcrumbList JSON-LD for category/product pages */
export const breadcrumbJsonLd = (items: BreadcrumbItem[]) => ({
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: items.map((item, index) => ({
    "@type": "ListItem",
    position: index + 1,
    name: item.name,
    item: item.url,
  })),
});
