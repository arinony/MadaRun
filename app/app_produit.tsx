import React, { useState, useEffect } from 'react';
import { View, TextInput, TouchableOpacity, Image, ScrollView, KeyboardAvoidingView, Platform, Alert, ActivityIndicator } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { ProductService } from '../database/productService';
import { NotificationService } from '../database/notificationService';
import { styles } from './app_produit_style';

export default function ProductFormScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const isEditing = !!params.id;

  const [image, setImage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(isEditing);
  const [formData, setFormData] = useState({
    nom: '',
    type: '',
    minStock: '',
    stockActuel: '',
    unite: ''
  });

  useEffect(() => {
    if (isEditing) {
      const product = ProductService.getProductById(Number(params.id));
      if (product) {
        setFormData({
          nom: product.name,
          type: product.type || '',
          minStock: product.min_stock.toString(),
          stockActuel: product.stock_actuel.toString(),
          unite: product.unite || ''
        });
        setImage(product.image_uri);
      }
      setIsLoading(false);
    }
  }, [params.id]);

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.7,
    });
    if (!result.canceled) setImage(result.assets[0].uri);
  };

  const handleSave = () => {
    const { nom, minStock, stockActuel, type, unite } = formData;
    if (!nom || !minStock) return Alert.alert("Erreur", "Champs obligatoires manquants.");

    const productData = {
      name: nom,
      type,
      min_stock: parseInt(minStock),
      stock_actuel: parseInt(stockActuel || minStock),
      unite,
      image_uri: image
    };

    try {
      if (isEditing) {
        ProductService.updateProduct(Number(params.id), productData);
        NotificationService.add("Produit Modifié", `Infos de ${nom} mises à jour.`, "info");
        Alert.alert("Succès", "Produit corrigé !");
      } else {
        ProductService.addProduct(productData);
        NotificationService.add("Nouveau Produit", `${nom} ajouté au stock.`, "success");
        Alert.alert("Succès", "Produit ajouté !");
      }
      router.replace('/(tabs)');
    } catch (e) {
      Alert.alert("Erreur", "Échec de l'opération.");
    }
  };

  if (isLoading) return <ActivityIndicator style={{flex: 1}} color="#800000" />;

  return (
    <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="chevron-back" size={32} color="#800000" />
        </TouchableOpacity>

        <View style={styles.imageContainer}>
          <Image 
            source={image ? { uri: image } : require('../assets/images/wine-bottle.png')} 
            style={styles.productImage} 
          />
          <TouchableOpacity style={styles.downloadButton} onPress={pickImage}>
            <Ionicons name="camera" size={26} color="#FFF" />
          </TouchableOpacity>
        </View>

        <View style={styles.formContainer}>
          <TextInput placeholder="Nom" style={styles.inputWrapper} value={formData.nom} onChangeText={(t) => setFormData({...formData, nom: t})} />
          <TextInput placeholder="Type (ex: Boisson)" style={styles.inputWrapper} value={formData.type} onChangeText={(t) => setFormData({...formData, type: t})} />
          <TextInput 
            placeholder={isEditing ? "Corriger stock actuel" : "Stock initial"} 
            style={styles.inputWrapper} keyboardType="numeric"
            value={isEditing ? formData.stockActuel : formData.minStock} 
            onChangeText={(t) => isEditing ? setFormData({...formData, stockActuel: t}) : setFormData({...formData, minStock: t})} 
          />
          <TextInput placeholder="Unité (ex: Bouteilles)" style={styles.inputWrapper} value={formData.unite} onChangeText={(t) => setFormData({...formData, unite: t})} />
        </View>

        <TouchableOpacity style={styles.submitButton} onPress={handleSave}>
          <Ionicons name={isEditing ? "save-outline" : "checkmark"} size={35} color="#FFF" />
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}