import type { User } from "@/types/auth";
import type { MenuItemDto } from "@/types/menu";
import type { UserRoleType } from "@/types/role";
import { createContext } from "react";

export interface AuthContextType {
  // State only
  currentRoleContext?: string,
  user: User | null;
  isLoading: boolean;
  isInitialized: boolean;
  isAuthenticated: boolean;
  menuItems: MenuItemDto[];
  isMenuLoading: boolean;
  isMenuError: boolean;

  // State setters only (no API calls)
  login: (token: string, userData: User, refreshToken?: string) => void;
  logout: () => void;
  updateUser: (userData: Partial<User>) => void;
  checkPermission: (permission: string) => boolean;
  refetchMenu: () => Promise<unknown>;
  updateSchoolContext: (schoolId: number,role?:UserRoleType) => void;
  resetRoleContext: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export default AuthContext;
