import { User as NextAuthUser } from "next-auth";
import { create } from "zustand";

export type User = NextAuthUser & { 
  isAdmin?: boolean;
  role?: string;
};

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

    // Use the role from NextAuth session (comes from database)
    const isAdmin = currentUser.role === "ADMIN";

    set({ currentUser: { ...currentUser, isAdmin } as User });
  },
}));
