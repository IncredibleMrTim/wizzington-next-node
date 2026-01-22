import { create } from "zustand";
import { devtools } from "zustand/middleware";
import { Order, OrderProduct } from "@/lib/types";
import { Prisma } from "@prisma/client";

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

export const useOrderStore = create<OrderState>()(
  devtools(
    (set) => ({
      currentOrder: null,
      totalCost: 0,

      setCurrentOrder: (order) => set({ currentOrder: order }),

      addProductToOrder: (product) =>
        set((state) => {
          if (!state.currentOrder) return state;

          return {
            currentOrder: {
              ...state.currentOrder,
              orderProducts: [...state.currentOrder.orderProducts, product],
            },
          };
        }),

      updateOrderProduct: (payload) =>
        set((state) => {
          if (!state.currentOrder) return state;

          let productIndex = state.currentOrder.orderProducts.findIndex(
            (product) => product.id === payload.uid
          );

          const updatedProducts = [...state.currentOrder.orderProducts];

          // If the product is not in the order then add it
          if (productIndex === -1) {
            updatedProducts.push({
              id: payload.uid || crypto.randomUUID(),
              productName: payload.name || "",
              productId: payload.productId,
              orderId: state.currentOrder.id,
              price: new Prisma.Decimal(payload.price || 0),
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
            new Prisma.Decimal(0);
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
        }),

      removeProductFromOrder: (productId) =>
        set((state) => {
          if (!state.currentOrder) return state;

          return {
            currentOrder: {
              ...state.currentOrder,
              orderProducts: state.currentOrder.orderProducts.filter(
                (product: OrderProduct) => product.productId !== productId
              ),
            },
          };
        }),

      clearCurrentOrder: () => set({ currentOrder: null, totalCost: 0 }),

      updateTotalCost: (cost) => set({ totalCost: cost }),
    }),
    { name: "OrderStore" }
  )
);
