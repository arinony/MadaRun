import db from './db';

export interface Product {
  id: number;
  name: string;
  type: string;
  min_stock: number;
  stock_actuel: number;
  unite: string;
  image_uri: string | null;
}

export const ProductService = {
  // Ajouter un produit
  addProduct: (p: Omit<Product, 'id'>) => {
    return db.runSync(
      `INSERT INTO products (name, type, min_stock, stock_actuel, unite, image_uri) VALUES (?, ?, ?, ?, ?, ?)`,
      [p.name, p.type, p.min_stock, p.stock_actuel, p.unite, p.image_uri]
    );
  },

  // Lister tous les produits
  getAllProducts: (): Product[] => {
    return db.getAllSync<Product>(`SELECT * FROM products ORDER BY id DESC`);
  },

  // Supprimer un produit
  deleteProduct: (id: number) => {
    return db.runSync(`DELETE FROM products WHERE id = ?`, [id]);
  },

  // Mettre à jour le stock
  updateStock: (id: number, newStock: number) => {
    return db.runSync(
      `UPDATE products SET stock_actuel = ? WHERE id = ?`,
      [newStock, id]
    );
  },

  // Trouver un produit par ID (CORRECTED)
  // On utilise 'null' car c'est le type de retour réel de SQLite
  getProductById: (id: number): Product | null => {
    return db.getFirstSync<Product>(`SELECT * FROM products WHERE id = ?`, [id]);
  },
  // Dans productService.ts, ajoute cette méthode :
updateProduct: (id: number, p: Omit<Product, 'id'>) => {
  return db.runSync(
    `UPDATE products SET name = ?, type = ?, min_stock = ?, stock_actuel = ?, unite = ?, image_uri = ? WHERE id = ?`,
    [p.name, p.type, p.min_stock, p.stock_actuel, p.unite, p.image_uri, id]
  );
},
};