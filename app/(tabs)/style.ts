import { StyleSheet, Platform, Dimensions } from 'react-native';
import { Colors } from '../../constants/theme';

const { width } = Dimensions.get('window');

export const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: '#FDFDFD' 
  },
  headerContainer: { 
    paddingTop: Platform.OS === 'ios' ? 60 : 45, 
    paddingHorizontal: 20 
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF',
    borderRadius: 100,
    paddingHorizontal: 20,
    height: 52,
    elevation: 8,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 10,
  },
  searchInput: { 
    flex: 1, 
    marginLeft: 12, 
    fontSize: 16,
    color: '#333'
  },
  titleRow: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    alignItems: 'center', 
    marginVertical: 25 
  },
  mainTitle: { 
    fontSize: 28, 
    fontWeight: '800', 
    color: '#1A1A1A' 
  },
  fab: {
    backgroundColor: Colors.primary, // #00CED1
    width: 65,
    height: 48,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 6,
    shadowColor: Colors.primary,
    shadowOpacity: 0.3,
    shadowRadius: 5,
    shadowOffset: { width: 0, height: 4 },
  },
  listContent: { 
    paddingHorizontal: 15, 
    paddingBottom: 120 // Espace pour ne pas cacher le dernier produit derrière les onglets
  },
  columnWrapper: { 
    justifyContent: 'space-between' 
  },
  card: {
    backgroundColor: '#FFF',
    width: (width / 2) - 22, // Calcul dynamique pour 2 colonnes propres
    borderRadius: 24,
    marginBottom: 20,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#F0F0F0',
    elevation: 4,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 8,
  },
  cardPressed: { 
    opacity: 0.9, 
    transform: [{ scale: 0.97 }] 
  },
  image: { 
    width: '100%', 
    height: 140,
    backgroundColor: '#F5F5F5'
  },
  infoContainer: { 
    padding: 12, 
    backgroundColor: '#FFF9F9' // Teinte rosée légère comme sur ton image
  },
  productTitle: { 
    color: '#7A0000', 
    fontWeight: 'bold', 
    fontSize: 16, 
    marginBottom: 6 
  },
  stockRow: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    alignItems: 'flex-end' 
  },
  stockLabel: { 
    fontSize: 12, 
    color: '#888',
    textTransform: 'uppercase',
    letterSpacing: 0.5
  },
  stockValue: { 
    fontSize: 17, 
    fontWeight: '800', 
    color: '#333' 
  },
  iconBadge: { 
    backgroundColor: '#7A0000', 
    padding: 6, 
    borderRadius: 10 
  },
  emptyText: { 
    textAlign: 'center', 
    marginTop: 60, 
    color: '#999',
    fontSize: 16
  },

  // Ajouts suggérés pour style.ts
modalOverlay: {
  flex: 1,
  backgroundColor: 'rgba(0,0,0,0.5)',
  justifyContent: 'flex-end',
},
modalContent: {
  backgroundColor: 'white',
  borderTopLeftRadius: 25,
  borderTopRightRadius: 25,
  padding: 20,
  paddingBottom: 40,
},
modalHandle: {
  width: 40,
  height: 5,
  backgroundColor: '#DDD',
  borderRadius: 10,
  alignSelf: 'center',
  marginBottom: 15,
},
modalTitle: {
  fontSize: 18,
  fontWeight: 'bold',
  textAlign: 'center',
  marginBottom: 20,
  color: '#333',
},
optionButton: {
  flexDirection: 'row',
  alignItems: 'center',
  padding: 15,
  borderRadius: 12,
  marginBottom: 10,
  backgroundColor: '#F8F9FA',
},
optionIcon: {
  width: 45,
  height: 45,
  borderRadius: 22,
  justifyContent: 'center',
  alignItems: 'center',
  marginRight: 15,
},
optionText: {
  fontSize: 16,
  fontWeight: '500',
  color: '#444',
},
cancelButton: {
  marginTop: 10,
  padding: 15,
  alignItems: 'center',
},
cancelButtonText: {
  fontSize: 16,
  color: '#AAA',
  fontWeight: '600',
},

});