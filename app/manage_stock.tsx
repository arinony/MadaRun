import React, { useState, useMemo, useEffect } from 'react';
import { View, Text, Image, TouchableOpacity, ScrollView, Alert, ActivityIndicator } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { ProductService, Product } from '../database/productService';
import { NotificationService } from '../database/notificationService';
import { styles } from './manage_stock_style';

export default function ManageStockScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  
  const [product, setProduct] = useState<Product | null>(null);
  const [adjustment, setAdjustment] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (params.id) {
      const data = ProductService.getProductById(Number(params.id));
      if (data) setProduct(data);
      else router.back();
      setIsLoading(false);
    }
  }, [params.id]);

  const newTotal = useMemo(() => (product ? product.stock_actuel + adjustment : 0), [product, adjustment]);

  const handleAdjust = (value: number) => {
    if (product && product.stock_actuel + (adjustment + value) < 0) {
      return Alert.alert("Attention", "Le stock ne peut pas être négatif");
    }
    setAdjustment(prev => prev + value);
  };

  const handleConfirm = () => {
    if (!product) return;
    try {
      ProductService.updateStock(product.id, newTotal);
      
      // Notification de mouvement
      NotificationService.add(
        "Mouvement Stock",
        `${product.name}: ${adjustment > 0 ? '+' : ''}${adjustment} ${product.unite}. (Total: ${newTotal})`,
        adjustment > 0 ? "success" : "info"
      );

      // Alerte stock bas
      if (newTotal <= product.min_stock) {
        NotificationService.add("Alerte Stock Bas", `Critique: ${product.name} (${newTotal})`, "warning");
      }

      Alert.alert("Succès", "Stock mis à jour");
      router.replace('/(tabs)');
    } catch (error) {
      Alert.alert("Erreur", "Échec de la mise à jour");
    }
  };

  const handleDelete = () => {
    Alert.alert("Supprimer", "Confirmer la suppression ?", [
      { text: "Annuler" },
      { text: "Supprimer", style: "destructive", onPress: () => {
        if (product) {
          ProductService.deleteProduct(product.id);
          NotificationService.add("Suppression", `${product.name} a été supprimé.`, "warning");
          router.replace('/(tabs)');
        }
      }}
    ]);
  };

  if (isLoading || !product) return <ActivityIndicator style={{ flex: 1 }} color="#800000" />;

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="chevron-back" size={32} color="#800000" />
        </TouchableOpacity>

        <View style={styles.imageContainer}>
          <Image source={product.image_uri ? { uri: product.image_uri } : require('../assets/images/wine-bottle.png')} style={styles.productImage} />
        </View>

        <View style={styles.card}>
          <Text style={styles.sectionTitle}>{product.name}</Text>
          <View style={styles.row}>
            <Text style={styles.label}>Stock actuel:</Text>
            <Text style={styles.value}>{product.stock_actuel}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Ajustement:</Text>
            <View style={styles.quantityContainer}>
              <TouchableOpacity onPress={() => handleAdjust(-1)}><Ionicons name="remove-circle" size={45} color="#A55" /></TouchableOpacity>
              <Text style={[styles.quantityText, { color: adjustment >= 0 ? '#4A4' : '#A55' }]}>{adjustment > 0 ? `+${adjustment}` : adjustment}</Text>
              <TouchableOpacity onPress={() => handleAdjust(1)}><Ionicons name="add-circle" size={45} color="#4A4" /></TouchableOpacity>
            </View>
          </View>
        </View>

        <View style={styles.card}>
          <View style={styles.row}><Text style={styles.unitLabel}>Unité :</Text><Text style={styles.unitValue}>{product.unite}</Text></View>
          <View style={styles.divider} />
          <View style={styles.row}><Text style={styles.unitLabel}>Nouveau Total:</Text><Text style={[styles.totalValue, { color: '#00CED1' }]}>{newTotal}</Text></View>
        </View>

        <View style={styles.actionButtonsContainer}>
          <TouchableOpacity style={[styles.confirmButton, { opacity: adjustment === 0 ? 0.5 : 1 }]} onPress={handleConfirm} disabled={adjustment === 0}>
            <Ionicons name="checkmark-done" size={35} color="#FFF" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.deleteButton} onPress={handleDelete}><Ionicons name="trash" size={30} color="#FFF" /></TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}