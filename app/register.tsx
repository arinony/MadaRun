import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, ScrollView, KeyboardAvoidingView, Platform, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { CustomButton } from '../components/CustomButton';
import { Colors } from '../constants/theme';
import { userService } from '../services/userService';
import { useAuth } from '../database/authService';

export default function RegisterScreen() {
  const router = useRouter();
  const { login } = useAuth();

  // États pour l'inscription
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleRegister = async () => {
    // 1. Validations de base
    if (!name || !email || !password || !confirmPassword) {
      Alert.alert("Erreur", "Tous les champs sont obligatoires");
      return;
    }
    if (password !== confirmPassword) {
      Alert.alert("Erreur", "Les mots de passe ne correspondent pas");
      return;
    }

    try {
      // 2. Appel au service SQLite
      await userService.registerUser(name, email, password);
      
      // 3. Mise à jour du contexte global
      login({ email, name });
      
      Alert.alert("Succès", "Compte créé avec succès !");
      router.replace('/(tabs)' as any);
    } catch (error) {
      Alert.alert("Erreur", "Cet email est déjà utilisé ou la base est inaccessible.");
    }
  };

  return (
    <KeyboardAvoidingView 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={{ flex: 1 }}
    >
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.title}>S'inscrire</Text>

        <View style={styles.inputContainer}>
          <TextInput 
            placeholder="Nom complet" 
            placeholderTextColor={Colors.placeholder}
            style={styles.input}
            value={name}
            onChangeText={setName}
          />
          <TextInput 
            placeholder="Email" 
            placeholderTextColor={Colors.placeholder}
            keyboardType="email-address"
            autoCapitalize="none"
            style={styles.input}
            value={email}
            onChangeText={setEmail}
          />
          <TextInput 
            placeholder="Mot de passe" 
            placeholderTextColor={Colors.placeholder}
            secureTextEntry
            style={styles.input}
            value={password}
            onChangeText={setPassword}
          />
          <TextInput 
            placeholder="Confirmer mot de passe" 
            placeholderTextColor={Colors.placeholder}
            secureTextEntry
            style={styles.input}
            value={confirmPassword}
            onChangeText={setConfirmPassword}
          />
        </View>

        <CustomButton title="S'inscrire" onPress={handleRegister} />

        <Text style={styles.footerText}>
          Tu as déjà un compte ? 
          <Text style={styles.link} onPress={() => router.push('/login')}> Se Connecter</Text>
        </Text>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flexGrow: 1, backgroundColor: Colors.Background, padding: 30, justifyContent: 'center' },
  title: { fontSize: 32, fontWeight: 'bold', textAlign: 'center', marginBottom: 40 },
  inputContainer: { marginBottom: 20 },
  input: {
    backgroundColor: '#FFF',
    height: 60,
    borderRadius: 20, 
    paddingHorizontal: 20,
    marginVertical: 10,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
  },
  footerText: { textAlign: 'center', marginTop: 20, fontSize: 14 },
  link: { color: Colors.primary, fontWeight: 'bold' }
});