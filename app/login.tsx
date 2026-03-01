import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TextInput, 
  Alert, 
  TouchableOpacity, 
  KeyboardAvoidingView, 
  Platform, 
  ScrollView 
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons'; // Assure-toi d'avoir expo-icons
import { CustomButton } from '../components/CustomButton';
import { Colors } from '../constants/theme';
import { userService } from '../services/userService';
import { useAuth } from '../database/authService';

export default function LoginScreen() {
  const router = useRouter();
  const { login } = useAuth();
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);

  const handleLogin = async () => {
    if (!email.trim() || !password.trim()) {
      Alert.alert("Champs requis", "Veuillez remplir l'email et le mot de passe.");
      return;
    }

    setIsSubmitting(true);

    try {
      const cleanEmail = email.toLowerCase().trim();
      const userFound = await userService.loginUser(cleanEmail, password);

      if (userFound) {
        await login({ 
          id: userFound.id, 
          email: userFound.email, 
          name: userFound.name 
        });
        router.replace('/(tabs)');
      } else {
        Alert.alert("Échec", "Email ou mot de passe incorrect.");
      }
    } catch (error) {
      console.error("Erreur Login:", error);
      Alert.alert("Erreur technique", "Impossible de contacter la base de données.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <KeyboardAvoidingView 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <ScrollView contentContainerStyle={styles.scrollContent} keyboardShouldPersistTaps="handled">
        <View style={styles.header}>
          <Text style={styles.title}>Bienvenue</Text>
          <Text style={styles.subtitle}>Connectez-vous pour accéder à votre inventaire</Text>
        </View>

        <View style={styles.form}>
          {/* Email Input */}
          <View style={styles.inputWrapper}>
            <TextInput 
              placeholder="Email" 
              placeholderTextColor="#999"
              style={styles.input}
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
              autoCorrect={false}
            />
          </View>

          {/* Password Input avec bouton "Voir" */}
          <View style={[styles.inputWrapper, styles.passwordRow]}>
            <TextInput 
              placeholder="Mot de passe" 
              placeholderTextColor="#999"
              secureTextEntry={!isPasswordVisible} 
              style={[styles.input, { flex: 1 }]}
              value={password}
              onChangeText={setPassword}
            />
            <TouchableOpacity 
              onPress={() => setIsPasswordVisible(!isPasswordVisible)}
              style={styles.eyeIcon}
            >
              <Ionicons 
                name={isPasswordVisible ? "eye-off" : "eye"} 
                size={24} 
                color="#999" 
              />
            </TouchableOpacity>
          </View>

          <TouchableOpacity onPress={() => Alert.alert("Aide", "Contactez votre administrateur.")}>
            <Text style={styles.forgotPass}>Mot de passe oublié ?</Text>
          </TouchableOpacity>
        </View>

        <CustomButton 
          title={isSubmitting ? "Connexion en cours..." : "Se connecter"} 
          onPress={handleLogin} 
          disabled={isSubmitting} 
        />

        <View style={styles.footer}>
          <Text style={styles.footerText}>Vous n'avez pas de compte ?</Text>
          <TouchableOpacity onPress={() => router.push('/register')}>
            <Text style={styles.link}> Inscrivez-vous</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8F9FA' },
  scrollContent: { flexGrow: 1, padding: 30, justifyContent: 'center' },
  header: { alignItems: 'center', marginBottom: 40 },
  title: { fontSize: 32, fontWeight: 'bold', color: '#333' },
  subtitle: { fontSize: 16, color: '#777', textAlign: 'center', marginTop: 10 },
  form: { marginBottom: 30 },
  inputWrapper: {
    backgroundColor: '#FFF',
    borderRadius: 15,
    marginBottom: 15,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 5,
  },
  passwordRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingRight: 15,
  },
  input: {
    height: 60,
    paddingHorizontal: 20,
    fontSize: 16,
    color: '#333',
  },
  eyeIcon: {
    padding: 5,
  },
  forgotPass: { textAlign: 'right', fontSize: 13, color: Colors.primary, fontWeight: '600', marginTop: 5 },
  footer: { flexDirection: 'row', justifyContent: 'center', marginTop: 30 },
  footerText: { fontSize: 14, color: '#666' },
  link: { color: Colors.primary, fontWeight: 'bold', fontSize: 14 }
});