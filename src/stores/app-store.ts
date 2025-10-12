import { create } from "zustand";

interface AppState {
  isRTL: boolean;
  setIsRTL: (isRTL: boolean) => void;
}

export const useAppStore = create<AppState>((set) => ({
  isRTL: false,
  setIsRTL: (isRTL) => set({ isRTL }),
}));
