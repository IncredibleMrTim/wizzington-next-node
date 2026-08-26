import { create } from "zustand"
import { createJSONStorage, devtools, persist } from "zustand/middleware"
import { Order, OrderProduct } from "@/lib/types"
import Decimal from "decimal.js"
import { calculateTotalCost } from "@/lib/order"

export interface OrderState {
  currentOrder: Order | null
  totalCost: number
  setCurrentOrder: (order: Order | null) => void
  addProductToOrder: (product: OrderProduct) => void
  updateOrderProduct: (payload: {
    productId: string
    name?: string
    uid?: string
    price?: number
    updates: Partial<OrderProduct>
  }) => void
  removeProductFromOrder: (productId: string) => void
  clearCurrentOrder: () => void
  updateTotalCost: (cost: number) => void
  _rehydrated: () => void
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
              if (!state.currentOrder) return state

              const updatedProducts = [
                ...state.currentOrder.orderProducts,
                product,
              ]

              return {
                currentOrder: {
                  ...state.currentOrder,
                  orderProducts: updatedProducts,
                },
                totalCost: calculateTotalCost(updatedProducts),
              }
            },
            false,
            "addProductToOrder",
          ),

        updateOrderProduct: (payload) =>
          set(
            (state) => {
              if (!state.currentOrder) return state

              let productIndex = state.currentOrder.orderProducts.findIndex(
                (product: OrderProduct) =>
                  product.productId === payload.productId,
              )

              const updatedProducts = [...state.currentOrder.orderProducts]

              // If the product is not in the order then add it
              if (productIndex === -1) {
                updatedProducts.push({
                  id: payload.uid || crypto.randomUUID(),
                  productName: payload.name || "",
                  productId: payload.productId,
                  orderId: state.currentOrder.id,
                  price: new Decimal(payload.price || 0),
                  quantity: 1,
                  createdAt: new Date(),
                })

                productIndex = updatedProducts.length - 1
              }

              // Update the product with the new values
              updatedProducts[productIndex] = {
                ...updatedProducts[productIndex],
                ...payload.updates,
              }

              return {
                currentOrder: {
                  ...state.currentOrder,
                  orderProducts: updatedProducts,
                },
                totalCost: calculateTotalCost(updatedProducts),
              }
            },
            false,
            "updateOrderProduct",
          ),

        removeProductFromOrder: (productId) =>
          set(
            (state) => {
              if (!state.currentOrder) return state

              const updatedProducts = state.currentOrder.orderProducts.filter(
                (product: OrderProduct) => product.productId !== productId,
              )

              return {
                currentOrder: {
                  ...state.currentOrder,
                  orderProducts: updatedProducts,
                },
                totalCost: calculateTotalCost(updatedProducts),
              }
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
              useOrderStore.getState()._rehydrated()
            }, 0)
          }
        },
      },
    ),
    { name: "OrderStore" },
  ),
)
