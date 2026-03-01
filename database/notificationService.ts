import db from './db';

export interface Notification {
  id: number;
  title: string;
  message: string;
  type: 'info' | 'warning' | 'success';
  created_at: string;
}

export const NotificationService = {
  // Ajouter une notification
  add: (title: string, message: string, type: 'info' | 'warning' | 'success') => {
    return db.runSync(
      `INSERT INTO notifications (title, message, type) VALUES (?, ?, ?)`,
      [title, message, type]
    );
  },

  // Récupérer toutes les notifications (les plus récentes en premier)
  getAll: (): Notification[] => {
    return db.getAllSync<Notification>(`SELECT * FROM notifications ORDER BY created_at DESC`);
  },

  // Nettoyer l'historique
  clearAll: () => {
    return db.runSync(`DELETE FROM notifications`);
  }
};