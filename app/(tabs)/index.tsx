import React from 'react';
import { View, Text, StyleSheet, FlatList, Image, TouchableOpacity, TextInput } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../../constants/theme';

// Données fictives basées sur ton image
const DATA = [
  { id: '1', title: 'Boisson 1', stock: '20', image: 'https://picsum.photos/200' },
  { id: '2', title: 'Boisson 2', stock: '15', image: 'https://picsum.photos/201' },
  { id: '3', title: 'Boisson 3', stock: '45', image: 'https://picsum.photos/202' },
  { id: '4', title: 'Boisson 4', stock: '10', image: 'https://picsum.photos/203' },
  { id: '5', title: 'Boisson 5', stock: '05', image: 'https://picsum.photos/204' },
  { id: '6', title: 'Boisson 6', stock: '30', image: 'https://picsum.photos/205' },
];

export default function ProductListScreen() {
  
  const renderProduct = ({ item }: any) => (
    <View style={styles.card}>
      <Image source={{ uri: item.image }} style={styles.image} />
      <View style={styles.infoContainer}>
        <Text style={styles.productTitle}>{item.title}</Text>
        <View style={styles.stockRow}>
          <Text style={styles.stockText}>Stock: {item.stock}</Text>
          <View style={styles.iconBadge}>
             <Ionicons name="cube" size={14} color="#FFF" />
          </View>
        </View>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      {/* Barre de recherche */}
      <View style={styles.searchSection}>
        <View style={styles.searchBar}>
          <Ionicons name="search" size={20} color="#00CED1" style={styles.searchIcon} />
          <TextInput 
            placeholder="Where are you going?" 
            style={styles.searchInput}
          />
        </View>
      </View>

      {/* Titre et Bouton Ajouter */}
      <View style={styles.headerRow}>
        <Text style={styles.title}>List Produit</Text>
        <TouchableOpacity style={styles.addButton}>
          <Ionicons name="add" size={30} color="#FFF" />
        </TouchableOpacity>
      </View>

      {/* Grille de produits */}
      <FlatList
        data={DATA}
        renderItem={renderProduct}
        keyExtractor={item => item.id}
        numColumns={2} // Pour faire la grille de 2 colonnes
        columnWrapperStyle={styles.row}
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8F9FA' },
  searchSection: { paddingTop: 60, paddingHorizontal: 20 },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF',
    borderRadius: 25,
    paddingHorizontal: 15,
    height: 50,
    elevation: 5,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 10,
  },
  searchIcon: { marginRight: 10 },
  searchInput: { flex: 1, color: '#000' },
  headerRow: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    alignItems: 'center', 
    padding: 20,
    marginTop: 10 
  },
  title: { fontSize: 22, fontWeight: 'bold' },
  addButton: {
    backgroundColor: '#00CED1',
    width: 70,
    height: 45,
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 5,
  },
  listContainer: { paddingHorizontal: 10, paddingBottom: 100 },
  row: { justifyContent: 'space-between' },
  card: {
    backgroundColor: '#FFF',
    width: '47%',
    borderRadius: 20,
    marginBottom: 20,
    overflow: 'hidden',
    elevation: 3,
    shadowOpacity: 0.1,
  },
  image: { width: '100%', height: 120 },
  infoContainer: { padding: 10, backgroundColor: '#FFF5F5' },
  productTitle: { color: '#800000', fontWeight: 'bold', fontSize: 16 },
  stockRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 5 },
  stockText: { fontWeight: '600' },
  iconBadge: { 
    backgroundColor: '#800000', 
    padding: 4, 
    borderRadius: 6 
  }
});