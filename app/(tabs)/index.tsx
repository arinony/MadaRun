import React, { useState, useCallback, useMemo } from 'react';
import { 
  View, 
  Text, 
  FlatList, 
  Image, 
  TouchableOpacity, 
  TextInput, 
  Modal,
  Pressable,
  Keyboard
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useFocusEffect } from '@react-navigation/native';
import { Colors } from '../../constants/theme';
import { ProductService, Product } from '../../database/productService';
import { styles } from './style';

// --- COMPOSANT : CARTE PRODUIT ---
const ProductCard = React.memo(({ item, onPress, onLongPress }: { 
  item: Product, 
  onPress: (p: Product) => void, 
  onLongPress: (p: Product) => void 
}) => {
  const ALERT_THRESHOLD = 20;
  const isLowStock = item.stock_actuel <= ALERT_THRESHOLD;

  return (
    <Pressable 
      style={({ pressed }) => [styles.card, pressed && styles.cardPressed]}
      onPress={() => onPress(item)}
      onLongPress={() => onLongPress(item)}
      delayLongPress={400}
    >
      <Image 
        source={item.image_uri ? { uri: item.image_uri } : { uri: 'https://picsum.photos/seed/600/400' }} 
        style={styles.image} 
        resizeMode="cover"
      />
      <View style={styles.infoContainer}>
        <Text style={styles.productTitle} numberOfLines={1}>{item.name}</Text>
        <View style={styles.stockRow}>
          <View>
            <Text style={styles.stockLabel}>Stock actuel</Text>
            <Text style={[styles.stockValue, isLowStock ? { color: '#FF4444', fontWeight: 'bold' } : { color: '#00CED1' }]}>
              {item.stock_actuel} 
              {isLowStock && <Ionicons name="warning" size={14} color="#FF4444" style={{ marginLeft: 5 }} />}
            </Text>
          </View>
          <View style={[styles.iconBadge, isLowStock ? { backgroundColor: '#FF4444' } : { backgroundColor: '#00CED1' }]}>
             <Ionicons name={isLowStock ? "alert-circle" : "cube"} size={14} color="#FFF" />
          </View>
        </View>
      </View>
    </Pressable>
  );
});

// --- ÉCRAN PRINCIPAL ---
export default function ProductListScreen() {
  const router = useRouter();
  
  // États
  const [products, setProducts] = useState<Product[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isModalVisible, setIsModalVisible] = useState(false);

  // Sync avec la DB
  useFocusEffect(
    useCallback(() => {
      const data = ProductService.getAllProducts();
      setProducts(data);
    }, [])
  );

  // LOGIQUE DE FILTRAGE (Senior Approach)
  // On calcule la liste filtrée sans modifier la liste originale
  const filteredProducts = useMemo(() => {
    if (!searchQuery.trim()) return products;
    
    return products.filter((p) => 
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (p.type && p.type.toLowerCase().includes(searchQuery.toLowerCase()))
    );
  }, [searchQuery, products]);

  const handleManageStock = (product: Product) => {
    Keyboard.dismiss(); // Fermer le clavier avant de naviguer
    router.push({ pathname: "/manage_stock", params: { id: product.id } });
  };

  const handleDelete = () => {
    if (selectedProduct) {
      ProductService.deleteProduct(selectedProduct.id);
      setProducts(prev => prev.filter(p => p.id !== selectedProduct.id));
      setIsModalVisible(false);
    }
  };

  return (
    <View style={styles.container}>
      {/* HEADER AVEC BARRE DE RECHERCHE FONCTIONNELLE */}
      <View style={styles.headerContainer}>
        <View style={styles.searchBar}>
          <Ionicons name="search" size={20} color={Colors.primary} />
          <TextInput 
            placeholder="Rechercher un produit..." 
            style={styles.searchInput} 
            placeholderTextColor="#AAA"
            value={searchQuery}
            onChangeText={setSearchQuery} // Met à jour l'état de recherche
            clearButtonMode="while-editing" // Standard iOS
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={() => setSearchQuery('')}>
              <Ionicons name="close-circle" size={20} color="#CCC" />
            </TouchableOpacity>
          )}
        </View>

        <View style={styles.titleRow}>
          <Text style={styles.mainTitle}>Mon Inventaire</Text>
          <TouchableOpacity 
            activeOpacity={0.7} 
            style={styles.fab} 
            onPress={() => router.push('/app_produit')}
          >
            <Ionicons name="add" size={35} color="#FFF" />
          </TouchableOpacity>
        </View>
      </View>

      {/* LISTE FILTRÉE */}
      <FlatList
        data={filteredProducts}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <ProductCard 
            item={item} 
            onPress={handleManageStock} 
            onLongPress={(p) => { setSelectedProduct(p); setIsModalVisible(true); }} 
          />
        )}
        numColumns={2}
        columnWrapperStyle={styles.columnWrapper}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={{ marginTop: 100, alignItems: 'center' }}>
            <Ionicons 
              name={searchQuery ? "search-outline" : "cube-outline"} 
              size={60} 
              color="#CCC" 
            />
            <Text style={{ color: '#AAA', marginTop: 10 }}>
              {searchQuery ? `Aucun résultat pour "${searchQuery}"` : "Aucun produit en stock"}
            </Text>
          </View>
        }
      />

      {/* MODAL D'OPTIONS */}
      <Modal visible={isModalVisible} transparent animationType="slide">
        <Pressable style={styles.modalOverlay} onPress={() => setIsModalVisible(false)}>
          <View style={styles.modalContent}>
            <View style={styles.modalHandle} />
            <Text style={styles.modalTitle}>{selectedProduct?.name}</Text>
            
            <TouchableOpacity style={styles.optionButton} onPress={() => {
              setIsModalVisible(false);
              router.push({ pathname: "/app_produit", params: { id: selectedProduct?.id } });
            }}>
              <View style={[styles.optionIcon, { backgroundColor: '#E0F7FA' }]}>
                <Ionicons name="create-outline" size={24} color="#00ACC1" />
              </View>
              <Text style={styles.optionText}>Modifier</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.optionButton} onPress={handleDelete}>
              <View style={[styles.optionIcon, { backgroundColor: '#FFEBEE' }]}>
                <Ionicons name="trash-outline" size={24} color="#FF5252" />
              </View>
              <Text style={[styles.optionText, { color: '#FF5252' }]}>Supprimer</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.cancelButton} onPress={() => setIsModalVisible(false)}>
              <Text style={styles.cancelButtonText}>Fermer</Text>
            </TouchableOpacity>
          </View>
        </Pressable>
      </Modal>
    </View>
  );
}