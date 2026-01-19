// Product Types
export interface ProductImage {
  id?: string;
  product_id?: string;
  url: string;
  order: number;
  created_at?: string;
}

export interface Product {
  id: string;
  name: string;
  description?: string | null;
  price?: number;
  stock?: number;
  isFeatured?: boolean;
  isEnquiryOnly?: boolean;
  category?: string | null;
  images?: ProductImage[];
  createdAt?: string;
  updatedAt?: string;
}

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
export interface Category {
  id: string;
  name: string;
  description?: string | null;
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateCategoryInput {
  name: string;
  description?: string;
}

export interface UpdateCategoryInput {
  id: string;
  name?: string;
  description?: string;
}

// Order Types
export interface OrderProduct {
  id: string;
  uid?: string;
  order_id?: string;
  productId: string;
  name: string;
  quantity: number;
  price: number;
  created_at?: string;
}

export interface Order {
  id: string;
  customer_name?: string | null;
  customer_email?: string | null;
  customer_phone?: string | null;
  status?: string;
  total_amount?: number;
  notes?: string | null;
  products: OrderProduct[];
  createdAt?: string;
  updatedAt?: string;
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
