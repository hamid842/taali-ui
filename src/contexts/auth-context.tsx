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
  user: User | null;
  isLoading: boolean;
  isInitialized: boolean; 
  isAuthenticated: boolean;
  login: (token: string, userData: User, refreshToken?: string) => void; 
  register: (userData: unknown) => Promise<void>;
  logout: () => void;
  updateUser: (userData: Partial<User>) => void;
  checkPermission: (permission: string) => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export default AuthContext;
