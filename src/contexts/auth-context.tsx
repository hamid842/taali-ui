import type { UserRoleType } from "@/types/role";
import { createContext } from "react";

export interface User {
  id: string;
  email: string;
  role: UserRoleType;
  firstName: string;
  lastName: string;
  phoneNumber?: string;
  avatar?: string;
  status?: string;
  createdAt?: string;
}

export interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (userData: unknown) => Promise<void>;
  logout: () => void;
  updateUser: (userData: Partial<User>) => void;
  checkPermission: (permission: string) => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export default AuthContext



