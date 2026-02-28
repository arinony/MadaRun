import React, { createContext, useState, useContext, ReactNode } from 'react';

// 1. Définition de l'utilisateur
interface User {
  email: string;
  name?: string;
}

// 2. Définition du contenu du Context
interface AuthContextType {
  user: User | null;
  login: (userData: User) => void;
  logout: () => void;
}

// 3. Création du Context (Bien mettre le .tsx pour que le < > soit accepté)
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// 4. Le Provider
export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);

  const login = (userData: User) => {
    setUser(userData);
  };

  const logout = () => {
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

// 5. Le Hook
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth doit être utilisé à l'intérieur d'un AuthProvider");
  }
  return context;
};