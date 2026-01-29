import { create } from "zustand";
import { createJSONStorage, devtools, persist } from "zustand/middleware";
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
  _rehydrated: () => void;
}

export const useOrderStore = create<OrderState>()(
  devtools(
    persist(
      (set) => ({
        currentOrder: null,
        totalCost: 0,

        setCurrentOrder: (order) =>
          set({ currentOrder: order }, false, "setCurrentOrder"),

        addProductToOrder: (product) =>
          set(
            (state) => {
              if (!state.currentOrder) return state;

              return {
                currentOrder: {
                  ...state.currentOrder,
                  orderProducts: [...state.currentOrder.orderProducts, product],
                },
              };
            },
            false,
            "addProductToOrder",
          ),

        updateOrderProduct: (payload) =>
          set(
            (state) => {
              if (!state.currentOrder) return state;

              let productIndex = state.currentOrder.orderProducts.findIndex(
                (product: OrderProduct) =>
                  product.productId === payload.productId,
              );

              const updatedProducts = [...state.currentOrder.orderProducts];

              // If the product is not in the order then add it
              if (productIndex === -1) {
                updatedProducts.push({
                  id: payload.uid || crypto.randomUUID(),
                  productName: payload.name || "",
                  productId: payload.productId,
                  orderId: state.currentOrder.id,
                  price: payload.price || 0,
                  quantity: 1,
                  createdAt: new Date(),
                });

                productIndex = updatedProducts.length - 1;
              }

              // Update the product with the new values
              updatedProducts[productIndex] = {
                ...updatedProducts[productIndex],
                ...payload.updates,
              };

              const finalPrice =
                payload.updates.price ??
                payload.price ??
                updatedProducts[productIndex].price ??
                0;
              const newTotalCost =
                (state.totalCost || 0) +
                Number(finalPrice) * (payload.updates.quantity || 1);

              return {
                currentOrder: {
                  ...state.currentOrder,
                  orderProducts: updatedProducts,
                },
                totalCost: newTotalCost,
              };
            },
            false,
            "updateOrderProduct",
          ),

        removeProductFromOrder: (productId) =>
          set(
            (state) => {
              if (!state.currentOrder) return state;

              return {
                currentOrder: {
                  ...state.currentOrder,
                  orderProducts: state.currentOrder.orderProducts.filter(
                    (product: OrderProduct) => product.productId !== productId,
                  ),
                },
              };
            },
            false,
            "removeProductFromOrder",
          ),

        clearCurrentOrder: () =>
          set({ currentOrder: null, totalCost: 0 }, false, "clearCurrentOrder"),

        updateTotalCost: (cost) =>
          set({ totalCost: cost }, false, "updateTotalCost"),

        _rehydrated: () =>
          set(
            (state) => state,
            false,
            "OrderStore Rehydrated from localStorage",
          ),
      }),
      {
        name: "OrderStore",
        storage: createJSONStorage(() => localStorage),
        onRehydrateStorage: () => (state) => {
          // Call _rehydrated method to trigger a named devtools action
          if (typeof window !== "undefined" && state?.currentOrder) {
            setTimeout(() => {
              useOrderStore.getState()._rehydrated();
            }, 0);
          }
        },
      },
    ),
    { name: "OrderStore" },
  ),
);
