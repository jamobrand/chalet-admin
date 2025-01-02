import { createContext, ReactNode, useCallback, useEffect, useState } from "react";
import { User } from "../types";
import Cookies from 'js-cookie';

export interface AuthContextProps {
    user: User | null;
    setUser: React.Dispatch<React.SetStateAction<User | null>>;
    isAdmin: boolean;
    logout: () => void;
  }

  export const AuthContext = createContext<AuthContextProps | undefined>(undefined);

  export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<User | null>(() => {
      const storedUser = localStorage.getItem('chaletInfo');
      return storedUser ? JSON.parse(storedUser) : null;
    });

    const isAdmin = user?.role === "SUPER_ADMIN" || false;
  
    useEffect(() => {
      if (user) {
        localStorage.setItem('chaletInfo', JSON.stringify(user));
      } else {
        localStorage.removeItem('chaletInfo');
      }
    }, [user]);
  
  
    const logout = useCallback(() => {
      setUser(null);
      localStorage.removeItem('chaletInfo');
      Cookies.remove('chalet-token');
      // toast.success("You have been logged out of your account.")
      // window.location.href = '/login';
      // Add any additional logout logic here (e.g., clearing local storage, redirecting)
    }, []);
  
    return (
      <AuthContext.Provider value={{ user, setUser, isAdmin, logout }}>
        {children}
      </AuthContext.Provider>
    );
  };