import { StyleSheet, Platform } from 'react-native';
import { Colors } from '../constants/theme';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF',
  },
  scrollContent: {
    paddingHorizontal: 25,
    paddingBottom: 40,
    alignItems: 'center',
  },
  backButton: {
    alignSelf: 'flex-start',
    marginTop: Platform.OS === 'ios' ? 60 : 40,
    padding: 10,
  },
  imageContainer: {
    alignItems: 'center',
    marginVertical: 20,
  },
  productImage: {
    width: 120,
    height: 180,
    resizeMode: 'contain',
  },
  downloadButton: {
    backgroundColor: '#00CED1',
    width: 120,
    height: 45,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: -20,
    elevation: 5,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 5,
    shadowOffset: { width: 0, height: 3 },
  },
  formContainer: {
    width: '100%',
    marginTop: 30,
  },
  inputWrapper: {
    backgroundColor: '#FFF',
    borderRadius: 30,
    height: 55,
    paddingHorizontal: 25,
    marginBottom: 20,
    justifyContent: 'center',
    elevation: 6,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
  },
  input: {
    fontSize: 16,
    color: '#333',
  },
  submitButton: {
    backgroundColor: '#00CED1',
    width: 100,
    height: 55,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
    elevation: 8,
    shadowColor: '#00CED1',
    shadowOpacity: 0.4,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 5 },
  }
});