import React, { createContext, useState, useContext, useEffect, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import db from './db'; // Ton instance SQLite

// --- TYPES & INTERFACES ---
export interface User {
  id: number;
  email: string;
  name: string;
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean; 
  login: (userData: User) => Promise<void>;
  logout: () => Promise<void>;
  updateUserProfile: (id: number, name: string) => void;
  updateUserPassword: (id: number, newPass: string) => void;
  checkCurrentPassword: (userId: number, currentPass: string) => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// --- PROVIDER ---
export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // RÉCUPÉRATION DE LA SESSION (SENIOR UX)
  // Permet de rester connecté même après avoir fermé l'application
  useEffect(() => {
    const restoreSession = async () => {
      try {
        const savedUser = await AsyncStorage.getItem('@user_session');
        if (savedUser) {
          setUser(JSON.parse(savedUser));
        }
      } catch (e) {
        console.error("Erreur lors de la restauration de la session:", e);
      } finally {
        setIsLoading(false);
      }
    };
    restoreSession();
  }, []);

  // CONNEXION
  const login = async (userData: User) => {
    setUser(userData);
    await AsyncStorage.setItem('@user_session', JSON.stringify(userData));
  };

  // DÉCONNEXION
  const logout = async () => {
  try {
    // 1. On vide d'abord le stockage local
    await AsyncStorage.removeItem('@user_session');
    // 2. On réinitialise l'état global (cela déclenchera le redirect du _layout)
    setUser(null);
    console.log("✅ Session fermée proprement");
  } catch (e) {
    console.error("Erreur lors de la déconnexion:", e);
  }
};

  // VÉRIFICATION DE SÉCURITÉ (ANCIEN MOT DE PASSE)
  const checkCurrentPassword = (userId: number, currentPass: string): boolean => {
    try {
      const result = db.getFirstSync<{ id: number }>(
        `SELECT id FROM users WHERE id = ? AND password = ?`,
        [userId, currentPass]
      );
      return !!result;
    } catch (e) {
      console.error("Erreur check password:", e);
      return false;
    }
  };

  // MISE À JOUR DU NOM (STATE + DB + STORAGE)
  const updateUserProfile = (id: number, name: string) => {
    try {
      // 1. Persistance SQL
      db.runSync(`UPDATE users SET name = ? WHERE id = ?`, [name, id]);
      
      // 2. Mise à jour de l'état global pour l'UI
      if (user) {
        const updatedUser = { ...user, name };
        setUser(updatedUser);
        // 3. Mise à jour de la session stockée
        AsyncStorage.setItem('@user_session', JSON.stringify(updatedUser));
      }
    } catch (e) {
      console.error("Erreur update profile:", e);
      throw e;
    }
  };

  // MISE À JOUR DU MOT DE PASSE
  const updateUserPassword = (id: number, newPassword: string) => {
    try {
      db.runSync(`UPDATE users SET password = ? WHERE id = ?`, [newPassword, id]);
    } catch (e) {
      console.error("Erreur update password:", e);
      throw e;
    }
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      isLoading, 
      login, 
      logout, 
      updateUserProfile, 
      updateUserPassword,
      checkCurrentPassword
    }}>
      {children}
    </AuthContext.Provider>
  );
};

// --- HOOK PERSONNALISÉ ---
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth doit être utilisé à l'intérieur d'un AuthProvider");
  }
  return context;
};