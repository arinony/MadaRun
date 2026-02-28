import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { CustomButton } from '../components/CustomButton';
import { Colors } from '../constants/theme';
import { userService } from '../services/userService';
import { useAuth } from '../database/authService';

export default function LoginScreen() {
  const router = useRouter();
  const { login } = useAuth();
  
  // États pour capturer la saisie
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert("Erreur", "Veuillez remplir tous les champs");
      return;
    }

    try {
      const user = await userService.loginUser(email, password);
      if (user) {
        login({ email: user.email, name: user.name });
        router.replace('/(tabs)' as any); // On entre dans l'app
      } else {
        Alert.alert("Erreur", "Email ou mot de passe incorrect");
      }
    } catch (error) {
      Alert.alert("Erreur", "Une erreur est survenue lors de la connexion");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Se connecter</Text>

      <View style={styles.inputContainer}>
        <TextInput 
          placeholder="Email" 
          placeholderTextColor={Colors.placeholder}
          style={styles.input}
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
        />
        <TextInput 
          placeholder="Mot de passe" 
          placeholderTextColor={Colors.placeholder}
          secureTextEntry 
          style={styles.input}
          value={password}
          onChangeText={setPassword}
        />
        <Text style={styles.forgotPass}>mot de passe oublié ?</Text>
      </View>

      <CustomButton 
        title="Se connecter" 
        onPress={handleLogin} 
      />

      <Text style={styles.footerText}>
        Vous n'avez pas encore de compte ? 
        <Text style={styles.link} onPress={() => router.push('/register')}> Inscrivez-vous</Text>
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.Background, padding: 30, justifyContent: 'center' },
  title: { fontSize: 32, fontWeight: 'bold', textAlign: 'center', marginBottom: 50 },
  inputContainer: { marginBottom: 30 },
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
  forgotPass: { textAlign: 'right', fontSize: 12, color: '#000', marginTop: 5 },
  footerText: { textAlign: 'center', marginTop: 20, fontSize: 14 },
  link: { color: Colors.primary, fontWeight: 'bold' }
});