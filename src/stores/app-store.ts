import { create } from "zustand";
import { persist } from "zustand/middleware";


interface AppState {
  isRTL: boolean;
  setIsRTL: (isRTL: boolean) => void;
  ownerHasSchool: boolean;
  setOwnerHasSchool: (value: boolean) => void;
}

export const useAppStore = create(
  persist<AppState>(
    (set) => ({
      isRTL: false,
      ownerHasSchool: false,
      setIsRTL: (isRTL) => set({ isRTL }),
      setOwnerHasSchool: (value) => set({ ownerHasSchool: value }),
    }),
    { name: "app-storage" } 
  )
);
