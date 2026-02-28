import { View, ImageBackground, StyleSheet, Text } from 'react-native';
import { useRouter } from 'expo-router';
import { CustomButton } from '../components/CustomButton';

export default function WelcomeScreen() {
  const router = useRouter();

  return (
    <ImageBackground 
      source={require('../assets/images/bar-bg.jpg')} 
      style={styles.container}
    >
      <View style={styles.overlay}>
        <CustomButton 
          title="allons-y" 
          onPress={() => router.push('/auth-selector')} 
        />
        <Text style={{color: '#FFF', marginTop: 10}}>Click to continue</Text>
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1,
     justifyContent: 'center',
     alignItems: 'center' },
  overlay: {
    padding: 30,
    width: '100%',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.3)', 
  }
});