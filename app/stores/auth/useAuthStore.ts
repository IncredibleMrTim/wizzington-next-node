import { User as NextAuthUser } from "next-auth";
import { create } from "zustand";

export type User = NextAuthUser & { isAdmin?: boolean };

export interface AuthState {
  currentUser: User | null;
  setCurrentUser: (currentUser: User | null) => void;
}

const initialState: AuthState = {
  currentUser: null,

  setCurrentUser: () => {},
};

export const useAuthStore = create<AuthState>()((set) => ({
  ...initialState,
  setCurrentUser: (currentUser: User | null) => {
    if (!currentUser) {
      set({ currentUser: null });
      return;
    }

    const adminWhiteList = process.env.NEXT_PUBLIC_ADMIN_WHITE_LIST || "";
    const userEmail = currentUser.email || "";
    const isAdmin = adminWhiteList.indexOf(userEmail) > -1;

    set({ currentUser: { ...currentUser, isAdmin } as User });
  },
}));
