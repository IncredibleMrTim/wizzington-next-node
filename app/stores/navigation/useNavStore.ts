import { create } from "zustand";
import { devtools } from "zustand/middleware";

export enum MenuItems {
  HOME = "Home",
  DRESSES = "Dresses",
  PAGEANT_ACCESSORIES = "Pageant Accessories",
  DANCE_ACCESSORIES = "Dance Accessories",
}

export type MenuItem = {
  name: MenuItems;
  path: string;
  isActive?: boolean;
};

export interface NavState {
  menuItems: MenuItem[];
  isDrawerOpen: boolean;
  setActiveMenuItem: (menuItem: MenuItem) => void;
  setIsDrawerOpen: (isOpen: boolean) => void;
}

const initialState: Omit<NavState, "setActiveMenuItem" | "setIsDrawerOpen"> = {
  menuItems: [
    { name: MenuItems.HOME, path: "/", isActive: true },
    { name: MenuItems.DRESSES, path: "/dresses", isActive: false },
    {
      name: MenuItems.PAGEANT_ACCESSORIES,
      path: "/pageant-accessories",
      isActive: false,
    },
    {
      name: MenuItems.DANCE_ACCESSORIES,
      path: "/dance-accessories",
      isActive: false,
    },
  ],
  isDrawerOpen: false,
};

export const useNavStore = create<NavState>()(
  devtools((set) => ({
    ...initialState,

    setActiveMenuItem: (menuItem: MenuItem) => {
      set((state) => ({
        menuItems: state.menuItems.map((item) => ({
          ...item,
          isActive: item.name === menuItem.name,
        })),
      }));
    },

    setIsDrawerOpen: (isOpen: boolean) => {
      set({ isDrawerOpen: isOpen });
    },
  }), { name: "NavStore" })
);
