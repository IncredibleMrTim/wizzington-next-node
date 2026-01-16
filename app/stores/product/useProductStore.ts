import { create } from "zustand";
import { Product } from "@/lib/types";

export interface ProductState {
  allProducts: Product[];
  currentProduct: Product | null;
  setProducts: (allProducts: Product[] | null) => void;
  setCurrentProduct: (currentProduct: Product | null) => void;
  clearCurrentProduct: () => void;
  updateProductImages: (images: Product["images"]) => void;
  updateAllProducts: (product: Product) => void;
  removeProduct: (productId: string) => void;
}

const initialState: ProductState = {
  allProducts: [],
  currentProduct: null,
  setProducts: () => {},
  setCurrentProduct: () => {},
  clearCurrentProduct: () => {},
  updateProductImages: () => {},
  updateAllProducts: () => {},
  removeProduct: () => {},
};

export const useProductStore = create<ProductState>()((set) => ({
  ...initialState,

  setProducts: (allProducts: Product[] | null) => {
    set({ allProducts: allProducts || [] });
  },

  setCurrentProduct: (currentProduct: Product | null) => {
    set({ currentProduct });
  },

  clearCurrentProduct: () => {
    set({ currentProduct: null });
  },

  updateProductImages: (images: Product["images"]) => {
    set((state) => {
      if (state.currentProduct) {
        return {
          currentProduct: {
            ...state.currentProduct,
            images,
          },
        };
      }
      return state;
    });
  },

  updateAllProducts: (product: Product) => {
    set((state) => {
      const index = state.allProducts.findIndex((p) => p.id === product.id);
      const updatedProducts = [...state.allProducts];

      if (index !== -1) {
        updatedProducts[index] = product;
      } else {
        updatedProducts.push(product);
      }

      return { allProducts: updatedProducts };
    });
  },

  removeProduct: (productId: string) => {
    set((state) => ({
      allProducts: state.allProducts.filter((p) => p.id !== productId),
    }));
  },
}));
