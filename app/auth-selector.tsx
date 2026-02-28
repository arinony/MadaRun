import { View, Text, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { CustomButton } from '../components/CustomButton';
import { Colors } from '../constants/theme';

export default function AuthSelectorScreen() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      {/* Logo MADA RUN */}
      <View style={styles.logoContainer}>
        <Text style={styles.logoText}>
          MADA <Text style={styles.logoHighlight}>RUN</Text>
        </Text>
      </View>

      {/* Boutons d'action */}
      <View style={styles.buttonContainer}>
        <CustomButton 
          title="Se connecter" 
          onPress={() => router.push('/login')} 
        />
        
        <CustomButton 
          title="Créer un compte" 
          outline={true} // C'est ici qu'il devient blanc avec bordure turquoise
          onPress={() => router.push('/register')} 
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.Background,
    padding: 30,
    justifyContent: 'space-around', // Aligne le logo en haut et boutons en bas
  },
  logoContainer: {
    alignItems: 'center',
    marginTop: 100,
  },
  logoText: {
    fontSize: 40,
    fontWeight: '900',
    letterSpacing: 2,
    color: '#000',
  },
  logoHighlight: {
    color: '#E63946', // Le rouge pour le mot "RUN"
  },
  buttonContainer: {
    width: '100%',
    marginBottom: 50,
  },
});