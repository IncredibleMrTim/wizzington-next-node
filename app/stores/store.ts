"use client";
import { configureStore, EnhancedStore } from "@reduxjs/toolkit";
import { useDispatch, TypedUseSelectorHook, useSelector } from "react-redux";
import { navReducer } from "./navigation/navSlice";

export const STORE_KEYS = {
  SET_PRODUCTS: "PRODUCTS/setProducts",
  SET_CURRENT_PRODUCT: "PRODUCTS/setCurrentProduct",
  UPDATE_PRODUCT_IMAGES: "PRODUCTS/updateProductImages",
  SET_ACTIVE_MENU_ITEM: "NAVIGATION/setActiveMenuItem",
  SET_DRAWER_IS_OPEN: "NAVIGATION/setIsDrawerOpen",
  SET_CURRENT_ORDER: "ORDER/setCurrentOrder",
  UPDATE_ORDER_PRODUCT: "ORDER/updateOrderProduct",
  SET_CURRENT_USER: "AUTH/setCurrentUser",
  CLEAR_CURRENT_PRODUCT: "PRODUCTS/clearCurrentProduct",
  UPDATE_ALL_PRODUCTS_WITH_NEW_PRODUCT:
    "PRODUCTS/updateAllProductsWithNewProduct",
};

export const store = configureStore({
  reducer: {
    nav: navReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({ serializableCheck: false }),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export type AppStore = EnhancedStore<RootState>;

export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
export const dispatch = store.dispatch;
