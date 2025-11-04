import type { StoreApi, UseBoundStore } from "zustand";

import { useAuthStore, useProductStore } from "../stores";

type ReduxDevToolsExtensionType = {
  connect: (options: { name: string; trace: boolean; traceLimit: number }) => {
    init: (state: unknown) => void;
    send: (action: string, state: unknown) => void;
  };
};

const STORES_SUBSCRIPTION_LIST: Record<
  string,
  UseBoundStore<StoreApi<unknown>>
> = {
  AuthStore: useAuthStore,
  ProductStore: useProductStore,
};

let globalState = {};

export const subscribeZustandStoresToReduxDevtool = () => {
  const zustandStoresList = Object.values(STORES_SUBSCRIPTION_LIST);
  const isDevelopment = process.env.NODE_ENV === "development";
  const hasStores = zustandStoresList.length > 0;
  const hasWindow = typeof window !== "undefined";
  const hasReduxDevTools = hasWindow && !!(
    window as unknown as {
      __REDUX_DEVTOOLS_EXTENSION__: ReduxDevToolsExtensionType;
    }
  )?.__REDUX_DEVTOOLS_EXTENSION__;

  console.log("🔍 Zustand DevTools Debug:");
  console.log("  - NODE_ENV:", process.env.NODE_ENV);
  console.log("  - Is Development:", isDevelopment);
  console.log("  - Stores count:", zustandStoresList.length);
  console.log("  - Has Stores:", hasStores);
  console.log("  - Window exists:", hasWindow);
  console.log("  - Redux DevTools available:", hasReduxDevTools);

  /**
   * Only subscribe to Redux DevTools when:
   *  - the application is in development mode
   *  - there are Zustand stores to subscribe to
   *  - the Redux DevTools extension is available in the browser
   */
  if (!isDevelopment || !hasStores || !hasWindow || !hasReduxDevTools) {
    console.log("❌ Redux DevTools not initialized - conditions not met");
    if (!isDevelopment) console.log("   Reason: Not in development mode");
    if (!hasStores) console.log("   Reason: No stores found");
    if (!hasWindow) console.log("   Reason: Window not available");
    if (!hasReduxDevTools) console.log("   Reason: Redux DevTools extension not found");
    return;
  }

  const browserReduxDevtoolExtension = (
    window as unknown as {
      __REDUX_DEVTOOLS_EXTENSION__: ReduxDevToolsExtensionType;
    }
  )?.__REDUX_DEVTOOLS_EXTENSION__;

  /**
   * Connect to the Redux DevTools extension in the browser.
   */
  const reduxDevtool = browserReduxDevtoolExtension.connect({
    name: "Wizzington Moo's UK - Zustand Stores",
    trace: true,
    traceLimit: 25,
  });

  /**
   * Initialize the Redux DevTools extension with the initial state of the stores.
   */
  const storeNames = Object.keys(STORES_SUBSCRIPTION_LIST);

  const initStoreStates = Object.fromEntries(
    storeNames.map((storeName) => [
      storeName,
      STORES_SUBSCRIPTION_LIST[storeName].getState(),
    ])
  );

  console.log("📊 Initial store states:", initStoreStates);
  reduxDevtool.init(initStoreStates);

  /**
   * Subscribe to changes in the Zustand stores and send updates to the Redux DevTools extension.
   */
  storeNames.forEach((storeName) => {
    STORES_SUBSCRIPTION_LIST[storeName].subscribe((state) => {
      globalState = { ...globalState, [storeName]: state };
      reduxDevtool.send(`${storeName} update`, globalState);
    });
  });

  console.log("✅ Redux DevTools connected successfully!");
  console.log("📦 Subscribed stores:", storeNames);
};
