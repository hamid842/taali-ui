import { create } from "zustand";
import { persist } from "zustand/middleware";

interface AppState {
  ownerHasSchool: boolean;
  setOwnerHasSchool: (value: boolean) => void;
}

export const useAppStore = create(
  persist<AppState>(
    (set) => ({
      ownerHasSchool: false,
      setOwnerHasSchool: (value) => set({ ownerHasSchool: value }),
    }),
    { name: "app-storage" }
  )
);
