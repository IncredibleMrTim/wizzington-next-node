import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import { Order, OrderProduct, Product } from "@/lib/types";

export interface OrderState {
  currentOrder: Order | null;
  setCurrentOrder: (order: Order | null) => void;
  addProductToOrder?: (product: Product) => void;
  updateOrderProduct?: (
    productId: string,
    updates: Partial<OrderProduct>,
    price?: number
  ) => void;
  removeProductFromOrder?: (productId: string) => void;
  clearCurrentOrder?: () => void;
  updateTotalCost?: (cost: number) => void;
  totalCost?: number;
}

const initialSate: OrderState = {
  currentOrder: null,
  setCurrentOrder: () => {},
  addProductToOrder: () => {},
  updateOrderProduct: () => {},
  removeProductFromOrder: () => {},
  clearCurrentOrder: () => {},
  updateTotalCost: (cost: number) => {},
  totalCost: 0,
};

export const orderSlice = createSlice({
  name: "ORDER",
  initialState: initialSate,
  reducers: {
    setCurrentOrder: (
      state,
      action: PayloadAction<Order>
    ) => {
      state.currentOrder = action.payload;
    },

    addProductToOrder: (
      state,
      action: PayloadAction<OrderProduct>
    ) => {
      if (state.currentOrder) {
        state.currentOrder.products.push({
          productId: action.payload.productId,
          quantity: action.payload.quantity,
          ...action.payload,
        });
      }
    },

    updateOrderProduct: (
      state,
      action: PayloadAction<{
        productId: string;
        name?: string;
        uid?: string;
        price?: number;
        updates: Partial<OrderProduct>;
      }>
    ) => {
      if (state.currentOrder) {
        let productIndex = state.currentOrder.products.findIndex(
          (product) => product.uid === action.payload.uid
        );

        // If the product is not in the order then add it
        if (productIndex === -1) {
          state.currentOrder.products.push({
            id: action.payload.uid || crypto.randomUUID(),
            uid: action.payload.uid || crypto.randomUUID(),
            name: action.payload.name || "",
            productId: action.payload.productId,
            price: action.payload.price || 0,
            quantity: 1,
          });
        }

        productIndex = state.currentOrder.products.findIndex(
          (product) => product.uid === action.payload.uid
        );

        // if the product is in the order then update it with the new values
        state.currentOrder.products[productIndex] = {
          ...state.currentOrder.products[productIndex],
          ...action.payload.updates,
        };

        state.totalCost =
          (state.totalCost || 0) +
          (action.payload.price || 0) * (action.payload.updates.quantity || 1);
      }
    },

    removeProductFromOrder: (state, action: PayloadAction<string>) => {
      if (state.currentOrder) {
        state.currentOrder.products = state.currentOrder.products.filter(
          (product) => product.productId !== action.payload
        );
      }
    },
  },
});
export const { setCurrentOrder, addProductToOrder, updateOrderProduct } =
  orderSlice.actions;
export const orderReducer = orderSlice.reducer;
