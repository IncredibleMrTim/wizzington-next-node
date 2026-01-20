import { Prisma } from "@prisma/client";

// Product Types
export type ProductImage = Prisma.ProductImageGetPayload<object>;

export type Product = Prisma.ProductGetPayload<{
  include: { images: true };
}>;

// DTO for server actions with serialized price
export type ProductDTO = {
  id: string;
  name: string;
  description: string | null;
  price: number;
  stock: number;
  isFeatured: boolean;
  isEnquiryOnly: boolean;
  categoryId: string | null;
  createdAt: Date;
  updatedAt: Date;
  images: ProductImage[];
};

export type Category = Prisma.CategoryGetPayload<object>;

export type OrderProduct = Prisma.OrderProductGetPayload<object>;

export type Order = Prisma.OrderGetPayload<{
  include: { orderProducts: true };
}>;

export interface CreateProductInput {
  name: string;
  description?: string;
  price?: number;
  stock?: number;
  isFeatured?: boolean;
  isEnquiryOnly?: boolean;
  category?: string;
  images?: Array<{ url: string; order: number }>;
}

export interface UpdateProductInput {
  id: string;
  name?: string;
  description?: string;
  price?: number;
  stock?: number;
  isFeatured?: boolean;
  isEnquiryOnly?: boolean;
  category?: string;
  images?: Array<{ url: string; order: number }>;
}

// Category Types
export type CategoryWithProducts = Prisma.CategoryGetPayload<{
  include: { products: true };
}>;

export interface CreateCategoryInput {
  name: string;
  description?: string;
}

export interface UpdateCategoryInput {
  id: string;
  name?: string;
  description?: string;
}

export interface CreateOrderInput {
  customer_name?: string;
  customer_email?: string;
  customer_phone?: string;
  notes?: string;
  products: Array<{
    productId: string;
    name: string;
    quantity: number;
    price: number;
  }>;
}

export interface UpdateOrderInput {
  id: string;
  customer_name?: string;
  customer_email?: string;
  customer_phone?: string;
  status?: string;
  notes?: string;
  products?: Array<{
    uid?: string;
    productId: string;
    name: string;
    quantity: number;
    price: number;
  }>;
}

// Prisma Input Types (for use throughout the app)
export type ProductCreateInput = Prisma.ProductCreateInput;
export type ProductUpdateInput = Prisma.ProductUpdateInput;
export type CategoryCreateInput = Prisma.CategoryCreateInput;
export type CategoryUpdateInput = Prisma.CategoryUpdateInput;
export type OrderCreateInput = Prisma.OrderCreateInput;
export type OrderUpdateInput = Prisma.OrderUpdateInput;

export enum USER_ROLE {
  ADMIN = "ADMIN",
  USER = "USER",
}
