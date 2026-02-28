import { TouchableOpacity, Text, StyleSheet } from 'react-native';
import { Colors } from '../constants/theme';

interface  CustomButtonProps {
    title: string;
    onPress: () => void;
    outline?: boolean;
}

export const CustomButton = ({ title, onPress, outline = false }: CustomButtonProps) => (
  <TouchableOpacity 
    onPress={onPress} 
    style={[styles.button, outline ? styles.outline : styles.filled]}
  >
    <Text style={[styles.text, { color: outline ? Colors.primary : '#FFF' }]}>
      {title}
    </Text>
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  button: {
    width: '100%',
    height: 55,
    borderRadius: 15, 
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 10,
  },
  filled: { backgroundColor: Colors.primary },
  outline: { 
    backgroundColor: '#FFF', 
    borderWidth: 2, 
    borderColor: Colors.primary 
  },
  text: { fontSize: 18, fontWeight: 'bold' }
});