import { create } from "zustand";
import { Order, OrderProduct } from "@/lib/types";

export interface OrderState {
  currentOrder: Order | null;
  totalCost: number;
  setCurrentOrder: (order: Order | null) => void;
  addProductToOrder: (product: OrderProduct) => void;
  updateOrderProduct: (payload: {
    productId: string;
    name?: string;
    uid?: string;
    price?: number;
    updates: Partial<OrderProduct>;
  }) => void;
  removeProductFromOrder: (productId: string) => void;
  clearCurrentOrder: () => void;
  updateTotalCost: (cost: number) => void;
}

export const useOrderStore = create<OrderState>((set) => ({
  currentOrder: null,
  totalCost: 0,

  setCurrentOrder: (order) => set({ currentOrder: order }),

  addProductToOrder: (product) =>
    set((state) => {
      if (!state.currentOrder) return state;

      return {
        currentOrder: {
          ...state.currentOrder,
          products: [...state.currentOrder.products, product],
        },
      };
    }),

  updateOrderProduct: (payload) =>
    set((state) => {
      if (!state.currentOrder) return state;

      let productIndex = state.currentOrder.products.findIndex(
        (product) => product.uid === payload.uid
      );

      const updatedProducts = [...state.currentOrder.products];

      // If the product is not in the order then add it
      if (productIndex === -1) {
        updatedProducts.push({
          id: payload.uid || crypto.randomUUID(),
          uid: payload.uid || crypto.randomUUID(),
          name: payload.name || "",
          productId: payload.productId,
          price: payload.price || 0,
          quantity: 1,
        });

        productIndex = updatedProducts.length - 1;
      }

      // Update the product with the new values
      updatedProducts[productIndex] = {
        ...updatedProducts[productIndex],
        ...payload.updates,
      };

      const newTotalCost =
        (state.totalCost || 0) +
        (payload.price || 0) * (payload.updates.quantity || 1);

      return {
        currentOrder: {
          ...state.currentOrder,
          products: updatedProducts,
        },
        totalCost: newTotalCost,
      };
    }),

  removeProductFromOrder: (productId) =>
    set((state) => {
      if (!state.currentOrder) return state;

      return {
        currentOrder: {
          ...state.currentOrder,
          products: state.currentOrder.products.filter(
            (product) => product.productId !== productId
          ),
        },
      };
    }),

  clearCurrentOrder: () => set({ currentOrder: null, totalCost: 0 }),

  updateTotalCost: (cost) => set({ totalCost: cost }),
}));
