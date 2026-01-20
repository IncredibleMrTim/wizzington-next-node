"use server";

import prisma from "@/lib/prisma";
import { ProductUpdateInput, ProductCreateInput, ProductDTO } from "@/lib/types";

export const getProducts = async (
  isFeatured?: boolean,
  categoryId?: string
): Promise<ProductDTO[]> => {
  const products = await prisma.product.findMany({
    where: { isFeatured, categoryId },
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

export const getProductById = async (id: string): Promise<ProductDTO | null> => {
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

export const updateProductById = async (
  id: string,
  input: ProductUpdateInput
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

  return {
    ...product,
    price: Number(product.price),
  };
};

export const createProduct = async (input: ProductCreateInput): Promise<ProductDTO> => {
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

  return {
    ...product,
    price: Number(product.price),
  };
};

export const deleteProduct = async (id: string) => {
  await prisma.product.delete({
    where: { id },
  });
};
