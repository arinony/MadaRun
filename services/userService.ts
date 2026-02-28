import db from '../database/db';

export const userService = {
  
  registerUser: async (name: string, email: string, pass: string): Promise<number> => {
    try {
      const result = await db.runAsync(
        'INSERT INTO users (name, email, password) VALUES (?, ?, ?)',
        [name, email, pass]
      );
      return result.lastInsertRowId; 
    } catch (error) {
      console.error("Erreur Inscription:", error);
      throw error;
    }
  },

  
  loginUser: async (email: string, pass: string): Promise<any> => {
    try {
      const user = await db.getFirstAsync(
        'SELECT * FROM users WHERE email = ? AND password = ?',
        [email, pass]
      );
      return user; 
    } catch (error) {
      console.error("Erreur Connexion:", error);
      throw error;
    }
  }
};