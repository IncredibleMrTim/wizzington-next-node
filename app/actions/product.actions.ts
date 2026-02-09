"use server";

import prisma from "@/lib/prisma";
import { revalidatePath, revalidateTag } from "next/cache";
import {
  ProductUpdateInput,
  ProductCreateInput,
  ProductDTO,
} from "@/lib/types";
import { unstable_cache } from "next/cache";
import { Prisma } from "@prisma/client";

export const getFeaturedProductCount = async (): Promise<number> => {
  return await prisma.product.count({
    where: { isFeatured: true },
  });
};

export const getProducts = async (
  isFeatured?: boolean,
  categoryId?: string,
): Promise<ProductDTO[]> => {
  const products = await prisma.product.findMany({
    where: { isFeatured, categoryId, deleted: false },
    include: {
      images: {
        orderBy: {
          orderPosition: "asc",
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return products.map((product) => ({
    ...product,
    price: Number(product.price),
  }));
};

export const getDeletedProducts = async (
  isFeatured?: boolean,
  categoryId?: string,
): Promise<ProductDTO[]> => {
  const products = await prisma.product.findMany({
    where: { isFeatured, categoryId, deleted: true },
    include: {
      images: {
        orderBy: {
          orderPosition: "asc",
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return products.map((product) => ({
    ...product,
    price: Number(product.price),
  }));
};

export const getCachedProducts = unstable_cache(
  async (isFeatured?: boolean, categoryId?: string) =>
    getProducts(isFeatured, categoryId),
  ["products"],
  { revalidate: 3600, tags: ["products"] },
);

export const getProductById = async (
  id: string,
): Promise<ProductDTO | null> => {
  const product = await prisma.product.findUnique({
    where: { id },
    include: {
      images: {
        orderBy: {
          orderPosition: "asc",
        },
      },
    },
  });

  if (!product) return null;

  return {
    ...product,
    price: Number(product.price),
  };
};

export const getCachedProductById = unstable_cache(
  async (id: string) => getProductById(id),
  ["product-detail"],
  {
    revalidate: 3600,
    tags: ["product-detail"],
  },
);

export const updateProductById = async (
  id: string,
  input: ProductUpdateInput,
): Promise<ProductDTO> => {
  const data: ProductUpdateInput = {};

  if (input.name !== undefined) data.name = input.name;
  if (input.description !== undefined) data.description = input.description;
  if (input.price !== undefined) data.price = input.price;
  if (input.stock !== undefined) data.stock = input.stock;
  if (input.isFeatured !== undefined) data.isFeatured = input.isFeatured;
  if (input.isEnquiryOnly !== undefined)
    data.isEnquiryOnly = input.isEnquiryOnly;
  if (input.category !== undefined) data.category = input.category;
  if (input.images !== undefined) data.images = input.images;

  const product = await prisma.product.update({
    where: { id },
    data,
    include: {
      images: {
        orderBy: {
          orderPosition: "asc",
        },
      },
    },
  });

  // Revalidate only this specific product's cache
  revalidateTag("product-detail", "max");
  // Revalidate the products list cache
  revalidateTag("products", "max");

  revalidatePath("/admin");
  // Revalidate the product details page (convert ID to URL slug format with dashes)
  revalidatePath(`/product/${id.replace(/\s+/g, "-")}`);

  return {
    ...product,
    price: Number(product.price),
  };
};

export const createProduct = async (
  input: ProductCreateInput,
): Promise<ProductDTO> => {
  const product = await prisma.product.create({
    data: input,
    include: {
      images: {
        orderBy: {
          orderPosition: "asc",
        },
      },
    },
  });

  // Revalidate the cached products data
  revalidateTag("products", "max");

  return {
    ...product,
    price: Number(product.price),
  };
};

export const deleteProduct = async (id: string) => {
  await prisma.product.update({
    where: { id },
    data: { deleted: true },
  });

  // Revalidate the cached products data
  revalidateTag("products", "max");
  revalidatePath("/admin/products");
};
