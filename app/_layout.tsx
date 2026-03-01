import { Stack, useRouter, useSegments } from 'expo-router';
import { AuthProvider, useAuth } from '../database/authService'; 
import { useEffect } from 'react';
import { View, ActivityIndicator, StyleSheet } from 'react-native';
import { initDB } from '../database/db';
import { Colors } from '../constants/theme';

function InitialLayout() {
  const { user, isLoading } = useAuth();
  const segments = useSegments();
  const router = useRouter();

  useEffect(() => {
    if (isLoading) return;

    // Analyse des segments : segments[0] est undefined à la racine (index.tsx)
    const currentSegment = segments[0] as string | undefined;

    // Dossiers/Fichiers accessibles sans connexion
    const authRoutes = ['login', 'register', 'auth-selector'];
    const isAtRoot = !currentSegment || currentSegment === '';
    const inAuthGroup = authRoutes.includes(currentSegment ?? '') || isAtRoot;

    // LOGIQUE DE PROTECTION (Route Guard)
    if (!user && !inAuthGroup) {
      // Pas de session -> Retour à l'accueil auth
      router.replace('/auth-selector');
    } else if (user && inAuthGroup) {
      // Session active -> On entre dans l'app
      router.replace('/(tabs)');
    }
  }, [user, isLoading, segments]);

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={Colors.primary} />
      </View>
    );
  }

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="index" />
      <Stack.Screen name="auth-selector" />
      <Stack.Screen name="login" />
      <Stack.Screen name="register" />
      <Stack.Screen name="(tabs)" />
    </Stack>
  );
}

export default function RootLayout() {
  useEffect(() => {
    try {
      initDB();
      console.log("✅ Database Ready");
    } catch (e) {
      console.error("❌ Database Init Error:", e);
    }
  }, []);

  return (
    <AuthProvider>
      <InitialLayout />
    </AuthProvider>
  );
}

const styles = StyleSheet.create({
  loadingContainer: { 
    flex: 1, 
    justifyContent: 'center', 
    alignItems: 'center', 
    backgroundColor: '#F8F9FA' 
  }
});