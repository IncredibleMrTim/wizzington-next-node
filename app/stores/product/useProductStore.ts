import { create } from "zustand";
import { devtools } from "zustand/middleware";
import { ProductDTO, ProductImage } from "@/lib/types";

export interface ProductState {
  allProducts: ProductDTO[];
  currentProduct: ProductDTO | null;
  setProducts: (allProducts: ProductDTO[] | null) => void;
  setCurrentProduct: (currentProduct: ProductDTO | null) => void;
  clearCurrentProduct: () => void;
  updateProductImages: (images: ProductImage[]) => void;
  updateAllProducts: (product: ProductDTO) => void;
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

export const useProductStore = create<ProductState>()(
  devtools(
    (set) => ({
      ...initialState,

      setProducts: (allProducts: ProductDTO[] | null) => {
        set({ allProducts: allProducts || [] });
      },

      setCurrentProduct: (currentProduct: ProductDTO | null) => {
        set({ currentProduct });
      },

      clearCurrentProduct: () => {
        set({ currentProduct: null });
      },

      updateProductImages: (images: ProductImage[]) => {
        set((state) => {
          if (state.currentProduct) {
            return {
              currentProduct: {
                ...state.currentProduct,
                images: images as ProductImage[],
              } as ProductDTO,
            };
          }
          return state;
        });
      },

      updateAllProducts: (product: ProductDTO) => {
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
    }),
    { name: "ProductStore" }
  )
);
