import React from 'react';
import { TouchableOpacity, Text, StyleSheet, ViewStyle, TextStyle } from 'react-native';
import { Colors } from '../constants/theme';

interface CustomButtonProps {
  title: string;
  onPress: () => void;
  disabled?: boolean;
  outline?: boolean; // Ajout de la prop outline
  style?: ViewStyle;
}

export const CustomButton = ({ title, onPress, disabled, outline, style }: CustomButtonProps) => {
  return (
    <TouchableOpacity 
      style={[
        styles.button, 
        outline && styles.outlineButton, // Style bordure
        style, 
        disabled && styles.disabled
      ]} 
      onPress={onPress}
      disabled={disabled}
      activeOpacity={0.8}
    >
      <Text style={[styles.text, outline && styles.outlineText]}>{title}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    backgroundColor: Colors.primary,
    padding: 18,
    borderRadius: 15,
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 8,
  },
  outlineButton: {
    backgroundColor: 'transparent',
    borderWidth: 2,
    borderColor: Colors.primary,
  },
  disabled: {
    backgroundColor: '#CCC',
    borderColor: '#CCC',
  },
  text: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  outlineText: {
    color: Colors.primary,
  },
});