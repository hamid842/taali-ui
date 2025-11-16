import type { UserRoleType } from "@/types/role";
import type { ISchool } from "@/types/school";
import { create } from "zustand";
import { persist } from "zustand/middleware";

interface AppState {
  isRTL: boolean;
  setIsRTL: (isRTL: boolean) => void;
  role: UserRoleType | null;
  setRole: (role: UserRoleType) => void;
  ownerHasSchool: boolean;
  setOwnerHasSchool: (value: boolean) => void;
  currentSchool: ISchool | null;
  setCurrentSchool: (currentSchool: ISchool | null) => void;
}

export const useAppStore = create(
  persist<AppState>(
    (set) => ({
      isRTL: false,
      ownerHasSchool: false,
      role: null,
      currentSchool: null,
      setCurrentSchool: (currentSchool: ISchool | null) =>
        set({ currentSchool }),
      setRole: (role) => set({ role }),
      setIsRTL: (isRTL) => set({ isRTL }),
      setOwnerHasSchool: (value) => set({ ownerHasSchool: value }),
    }),
    { name: "app-storage" }
  )
);
