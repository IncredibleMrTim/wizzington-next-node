import { configureStore } from "@reduxjs/toolkit";

import { ReducersMapObject } from "@reduxjs/toolkit";
import { Provider } from "react-redux";
import { QueryClientProvider, QueryClient } from "@tanstack/react-query";

export interface StoreProps {
  preloadedState?: object;
  reducer?: ReducersMapObject;
}

const createMockStore = ({ preloadedState, reducer }: StoreProps) => {
  return 
};

export const setupStore = ({ preloadedState, reducer }: StoreProps) =>
  configureStore({
    reducer,
    preloadedState,
  });

export const renderWithProviders = ({
  preloadedState,
  reducer,
  children,
}: {
  preloadedState?: object;
  reducer?: ReducersMapObject;

  children?: any;
}) => {
  const queryClient = new QueryClient();

  const store = setupStore({ reducer, preloadedState });

  return (
    <Provider store={store}>
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    </Provider>
  );
};
