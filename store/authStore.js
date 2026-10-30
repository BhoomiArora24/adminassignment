import { create } from "zustand";
// Mirror of the Auth.js session for client components. The token is kept in memory only (never localStorage).
export const useAuthStore = create((set) => ({
  status: "loading", user: null, token: null,
  setSession: (status, data) => set({ status, user: data?.user ?? null, token: data?.accessToken ?? null }),
  clear: () => set({ status: "unauthenticated", user: null, token: null }),
}));
