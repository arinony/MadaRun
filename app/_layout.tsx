import { Stack } from 'expo-router';
import { AuthProvider } from '../database/authService'; 
import { useEffect } from 'react';
import { initDB } from '../database/db';

export default function RootLayout() {
  
  // On initialise la base de données au tout début
  useEffect(() => {
    try {
      initDB();
      console.log("Base de données initialisée !");
    } catch (e) {
      console.error("Erreur DB init:", e);
    }
  }, []);

  return (
    // C'est ICI que la magie opère : AuthProvider doit entourer le Stack
    <AuthProvider>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="index" />
        <Stack.Screen name="auth-selector" />
        <Stack.Screen name="login" />
        <Stack.Screen name="register" />
        <Stack.Screen name="(tabs)" />
      </Stack>
    </AuthProvider>
  );
}