import React, { useState, useCallback } from 'react';
import { 
  View, Text, StyleSheet, FlatList, TouchableOpacity, 
  Alert, Modal, TextInput, KeyboardAvoidingView, Platform 
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';
import { NotificationService, Notification } from '../../database/notificationService';
import { useAuth } from '../../database/authService'; // Import Senior
import { Colors } from '../../constants/theme';

export default function NotificationsScreen() {
  const { user, checkCurrentPassword } = useAuth();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  
  // États pour la sécurité
  const [isAuthVisible, setIsAuthVisible] = useState(false);
  const [passwordInput, setPasswordInput] = useState('');

  useFocusEffect(
    useCallback(() => {
      loadNotifications();
    }, [])
  );

  const loadNotifications = () => {
    const data = NotificationService.getAll();
    setNotifications(data);
  };

  const handleRequestClear = () => {
    Alert.alert(
      "Action Critique", 
      "Cette action supprimera tout l'historique de manière irréversible.",
      [
        { text: "Annuler", style: "cancel" },
        { text: "Continuer", onPress: () => setIsAuthVisible(true) }
      ]
    );
  };

  const confirmAndClear = () => {
    // Vérification via le service Auth
    const isValid = checkCurrentPassword(user!.id, passwordInput);
    
    if (isValid) {
      NotificationService.clearAll();
      setNotifications([]);
      setIsAuthVisible(false);
      setPasswordInput('');
      Alert.alert("Succès", "L'historique a été nettoyé.");
    } else {
      Alert.alert("Échec", "Mot de passe incorrect.");
    }
  };

  const renderIcon = (type: string) => {
    switch (type) {
      case 'warning': return { name: 'warning', color: '#FF4444', bg: '#FFEBEE' };
      case 'success': return { name: 'checkmark-circle', color: '#00C851', bg: '#E8F5E9' };
      default: return { name: 'information-circle', color: '#33B5E5', bg: '#E3F2FD' };
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Notifications</Text>
        {notifications.length > 0 && (
          <TouchableOpacity onPress={handleRequestClear} style={styles.clearBadge}>
            <Ionicons name="trash-outline" size={16} color="#FF4444" />
            <Text style={styles.clearText}>Effacer</Text>
          </TouchableOpacity>
        )}
      </View>

      <FlatList
        data={notifications}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
        renderItem={({ item }) => {
          const icon = renderIcon(item.type);
          return (
            <View style={styles.notiCard}>
              <View style={[styles.iconContainer, { backgroundColor: icon.bg }]}>
                <Ionicons name={icon.name as any} size={24} color={icon.color} />
              </View>
              <View style={styles.textContainer}>
                <Text style={styles.notiTitle}>{item.title}</Text>
                <Text style={styles.notiMessage}>{item.message}</Text>
                <Text style={styles.notiTime}>{new Date(item.created_at).toLocaleString()}</Text>
              </View>
            </View>
          );
        }}
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <Ionicons name="notifications-off-outline" size={80} color="#CCC" />
            <Text style={styles.emptyText}>Aucun mouvement enregistré</Text>
          </View>
        }
      />

      {/* MODAL DE CONFIRMATION DE SÉCURITÉ */}
      <Modal visible={isAuthVisible} transparent animationType="fade">
        <KeyboardAvoidingView 
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'} 
          style={styles.modalOverlay}
        >
          <View style={styles.modalContent}>
            <View style={styles.lockIcon}>
              <Ionicons name="lock-closed" size={30} color={Colors.primary} />
            </View>
            <Text style={styles.modalTitle}>Validation requise</Text>
            <Text style={styles.modalSub}>Entrez votre mot de passe pour confirmer la suppression totale.</Text>
            
            <TextInput
              style={styles.input}
              placeholder="Mot de passe"
              secureTextEntry
              value={passwordInput}
              onChangeText={setPasswordInput}
              autoFocus
            />

            <View style={styles.modalActions}>
              <TouchableOpacity 
                style={styles.btnCancel} 
                onPress={() => { setIsAuthVisible(false); setPasswordInput(''); }}
              >
                <Text style={styles.btnCancelText}>Annuler</Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={[styles.btnConfirm, !passwordInput && { opacity: 0.5 }]} 
                onPress={confirmAndClear}
                disabled={!passwordInput}
              >
                <Text style={styles.btnConfirmText}>Confirmer</Text>
              </TouchableOpacity>
            </View>
          </View>
        </KeyboardAvoidingView>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8F9FA' },
  header: { 
    paddingTop: 60, 
    paddingHorizontal: 20, 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    alignItems: 'center',
    marginBottom: 20 
  },
  title: { fontSize: 28, fontWeight: 'bold', color: '#333' },
  clearBadge: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    backgroundColor: '#FFEBEE', 
    paddingVertical: 6, 
    paddingHorizontal: 12, 
    borderRadius: 20 
  },
  clearText: { color: '#FF4444', fontWeight: 'bold', marginLeft: 5, fontSize: 13 },
  list: { paddingHorizontal: 20, paddingBottom: 20 },
  notiCard: { 
    flexDirection: 'row', backgroundColor: '#FFF', 
    padding: 15, borderRadius: 15, marginBottom: 12,
    elevation: 3, shadowColor: '#000', shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 2 }, shadowRadius: 5
  },
  iconContainer: { width: 48, height: 48, borderRadius: 24, justifyContent: 'center', alignItems: 'center', marginRight: 15 },
  textContainer: { flex: 1 },
  notiTitle: { fontSize: 15, fontWeight: 'bold', color: '#333' },
  notiMessage: { fontSize: 13, color: '#666', marginTop: 3 },
  notiTime: { fontSize: 10, color: '#AAA', marginTop: 8 },
  emptyState: { marginTop: 100, alignItems: 'center' },
  emptyText: { marginTop: 10, color: '#AAA', fontSize: 15 },
  
  // Modal Security Styles
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.7)', justifyContent: 'center', padding: 25 },
  modalContent: { backgroundColor: '#FFF', borderRadius: 25, padding: 25, alignItems: 'center' },
  lockIcon: { width: 60, height: 60, borderRadius: 30, backgroundColor: '#E0F2F1', justifyContent: 'center', alignItems: 'center', marginBottom: 15 },
  modalTitle: { fontSize: 20, fontWeight: 'bold', color: '#333' },
  modalSub: { fontSize: 14, color: '#777', textAlign: 'center', marginTop: 8, marginBottom: 20 },
  input: { width: '100%', backgroundColor: '#F5F5F5', padding: 15, borderRadius: 12, fontSize: 16, textAlign: 'center', marginBottom: 20 },
  modalActions: { flexDirection: 'row', width: '100%' },
  btnCancel: { flex: 1, padding: 15, alignItems: 'center' },
  btnCancelText: { color: '#777', fontWeight: '600' },
  btnConfirm: { flex: 1, backgroundColor: '#FF4444', padding: 15, borderRadius: 12, alignItems: 'center' },
  btnConfirmText: { color: '#FFF', fontWeight: 'bold' }
});