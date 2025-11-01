import type { MenuItemDto } from "@/types/menu";
import type { UserRoleType } from "@/types/role";
import { createContext } from "react";

export interface User {
  userId: string;
  email: string;
  role: UserRoleType;
  firstName: string;
  lastName: string;
}

export interface AuthContextType {
  // State only
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
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export default AuthContext;
