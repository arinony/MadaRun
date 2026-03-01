import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  TextInput, 
  Modal, 
  Alert, 
  ScrollView, 
  KeyboardAvoidingView, 
  Platform 
} from 'react-native';
import { useAuth } from '../../database/authService';
import { NotificationService } from '../../database/notificationService';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../../constants/theme';

export default function ProfileScreen() {
  const { user, logout, updateUserProfile, updateUserPassword, checkCurrentPassword } = useAuth();

  // États pour les Modals
  const [isNameModalVisible, setNameModalVisible] = useState(false);
  const [isPassModalVisible, setPassModalVisible] = useState(false);

  // États pour les formulaires
  const [newName, setNewName] = useState(user?.name || '');
  const [passwords, setPasswords] = useState({ old: '', next: '', confirm: '' });
  const [showOldPass, setShowOldPass] = useState(false);
  const [showNextPass, setShowNextPass] = useState(false);

  // --- LOGIQUE : MISE À JOUR DU NOM ---
  const handleUpdateName = async () => {
    if (!newName.trim()) {
      Alert.alert("Erreur", "Le nom ne peut pas être vide.");
      return;
    }
    
    try {
      // On utilise await car updateUserProfile doit être async dans authService
      await updateUserProfile(user!.id, newName.trim());
      NotificationService.add("Profil", "Nom modifié avec succès", "info");
      setNameModalVisible(false);
      Alert.alert("Succès", "Votre nom a été mis à jour.");
    } catch (e) {
      Alert.alert("Erreur", "Impossible de mettre à jour le profil.");
    }
  };

  // --- LOGIQUE : MISE À JOUR MOT DE PASSE ---
  const handleUpdatePassword = async () => {
    const { old, next, confirm } = passwords;

    // 1. Vérification de l'ancien mot de passe via la DB
    const isOldCorrect = checkCurrentPassword(user!.id, old);
    if (!isOldCorrect) {
      Alert.alert("Sécurité", "L'ancien mot de passe est incorrect.");
      return;
    }

    // 2. Validations de format
    if (next.length < 4) {
      Alert.alert("Sécurité", "Le nouveau mot de passe doit faire au moins 4 caractères.");
      return;
    }

    if (next !== confirm) {
      Alert.alert("Sécurité", "Les nouveaux mots de passe ne correspondent pas.");
      return;
    }

    try {
      await updateUserPassword(user!.id, next);
      NotificationService.add("Sécurité", "Mot de passe changé", "warning");
      setPassModalVisible(false);
      setPasswords({ old: '', next: '', confirm: '' });
      Alert.alert("Succès", "Votre clé d'accès a été modifiée !");
    } catch (e) {
      Alert.alert("Erreur", "Échec de la mise à jour SQL.");
    }
  };

  // --- LOGIQUE : DÉCONNEXION (À LA FACEBOOK) ---
  const handleLogout = () => {
    Alert.alert(
      "Déconnexion",
      "Voulez-vous vraiment vous déconnecter ?",
      [
        { text: "Annuler", style: "cancel" },
        { 
          text: "Se déconnecter", 
          style: "destructive", 
          onPress: async () => {
            await logout(); 
            // La redirection auto est gérée par le _layout.tsx
          } 
        }
      ]
    );
  };

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        
        {/* HEADER PROFIL */}
        <View style={styles.profileHeader}>
          <View style={styles.avatar}>
            <Ionicons name="person" size={45} color="#FFF" />
          </View>
          <Text style={styles.userName}>{user?.name}</Text>
          <Text style={styles.userEmail}>{user?.email}</Text>
        </View>

        {/* MENU DES PARAMÈTRES */}
        <View style={styles.menuSection}>
          <Text style={styles.sectionTitle}>Paramètres du compte</Text>
          
          <TouchableOpacity style={styles.menuItem} onPress={() => setNameModalVisible(true)}>
            <View style={[styles.iconBox, { backgroundColor: '#E3F2FD' }]}>
              <Ionicons name="pencil" size={20} color={Colors.primary} />
            </View>
            <Text style={styles.menuText}>Modifier mon nom</Text>
            <Ionicons name="chevron-forward" size={18} color="#CCC" />
          </TouchableOpacity>

          <TouchableOpacity style={styles.menuItem} onPress={() => setPassModalVisible(true)}>
            <View style={[styles.iconBox, { backgroundColor: '#FFF3E0' }]}>
              <Ionicons name="lock-closed" size={20} color="#FF9800" />
            </View>
            <Text style={styles.menuText}>Sécurité & Mot de passe</Text>
            <Ionicons name="chevron-forward" size={18} color="#CCC" />
          </TouchableOpacity>

          {/* BOUTON DÉCONNEXION */}
          <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
            <Ionicons name="log-out-outline" size={22} color="#FF3B30" />
            <Text style={styles.logoutText}>Déconnexion</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* MODAL : CHANGEMENT DE NOM */}
      <Modal visible={isNameModalVisible} animationType="fade" transparent>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Modifier le nom</Text>
            <TextInput 
              style={styles.modalInput} 
              value={newName} 
              onChangeText={setNewName} 
              placeholder="Votre nom complet"
              autoFocus 
            />
            <View style={styles.modalButtons}>
              <TouchableOpacity onPress={() => setNameModalVisible(false)} style={styles.btnCancel}>
                <Text style={styles.btnCancelText}>Annuler</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={handleUpdateName} style={styles.btnSave}>
                <Text style={styles.btnSaveText}>Enregistrer</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* MODAL : CHANGEMENT DE MOT DE PASSE */}
      <Modal visible={isPassModalVisible} animationType="slide" transparent>
        <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Changer le mot de passe</Text>
            
            {/* Ancien MDP */}
            <View style={styles.inputContainer}>
              <TextInput 
                style={styles.flexInput} 
                placeholder="Ancien mot de passe" 
                secureTextEntry={!showOldPass} 
                onChangeText={(t) => setPasswords({...passwords, old: t})}
              />
              <TouchableOpacity onPress={() => setShowOldPass(!showOldPass)}>
                <Ionicons name={showOldPass ? "eye-off" : "eye"} size={20} color="#999" />
              </TouchableOpacity>
            </View>

            <View style={styles.divider} />

            {/* Nouveau MDP */}
            <View style={styles.inputContainer}>
              <TextInput 
                style={styles.flexInput} 
                placeholder="Nouveau mot de passe" 
                secureTextEntry={!showNextPass} 
                onChangeText={(t) => setPasswords({...passwords, next: t})}
              />
              <TouchableOpacity onPress={() => setShowNextPass(!showNextPass)}>
                <Ionicons name={showNextPass ? "eye-off" : "eye"} size={20} color="#999" />
              </TouchableOpacity>
            </View>

            <TextInput 
              style={styles.modalInput} 
              placeholder="Confirmer le nouveau" 
              secureTextEntry={!showNextPass} 
              onChangeText={(t) => setPasswords({...passwords, confirm: t})}
            />

            <View style={styles.modalButtons}>
              <TouchableOpacity onPress={() => setPassModalVisible(false)} style={styles.btnCancel}>
                <Text style={styles.btnCancelText}>Annuler</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={handleUpdatePassword} style={styles.btnSave}>
                <Text style={styles.btnSaveText}>Confirmer</Text>
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
  scrollContent: { paddingBottom: 40 },
  profileHeader: { 
    backgroundColor: '#FFF', 
    paddingTop: 60, 
    paddingBottom: 40, 
    alignItems: 'center',
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    elevation: 3,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 10,
  },
  avatar: { 
    width: 90, height: 90, borderRadius: 45, 
    backgroundColor: Colors.primary, 
    justifyContent: 'center', alignItems: 'center', marginBottom: 15,
    borderWidth: 4, borderColor: '#FFF',
  },
  userName: { fontSize: 22, fontWeight: 'bold', color: '#333' },
  userEmail: { fontSize: 14, color: '#999', marginTop: 4 },
  menuSection: { padding: 20 },
  sectionTitle: { fontSize: 13, fontWeight: '700', color: '#BBB', marginBottom: 15, textTransform: 'uppercase', letterSpacing: 1 },
  menuItem: {
    flexDirection: 'row', alignItems: 'center', 
    backgroundColor: '#FFF', padding: 14, borderRadius: 16, marginBottom: 10,
    elevation: 1, shadowColor: '#000', shadowOpacity: 0.05,
  },
  iconBox: { width: 40, height: 40, borderRadius: 12, justifyContent: 'center', alignItems: 'center', marginRight: 15 },
  menuText: { flex: 1, fontSize: 16, color: '#444', fontWeight: '500' },
  logoutButton: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    padding: 18, marginTop: 20, borderRadius: 16, backgroundColor: '#FFF',
    borderWidth: 1, borderColor: '#FFEBEB'
  },
  logoutText: { marginLeft: 10, color: '#FF3B30', fontSize: 16, fontWeight: '700' },
  
  // Modals UI
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', padding: 25 },
  modalContent: { backgroundColor: '#FFF', borderRadius: 28, padding: 25, elevation: 20 },
  modalTitle: { fontSize: 20, fontWeight: 'bold', marginBottom: 20, textAlign: 'center', color: '#333' },
  inputContainer: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#F5F5F5', borderRadius: 12, paddingHorizontal: 15, marginBottom: 10 },
  flexInput: { flex: 1, height: 50, fontSize: 15 },
  modalInput: { backgroundColor: '#F5F5F5', padding: 15, borderRadius: 12, marginBottom: 10, fontSize: 15 },
  divider: { height: 1, backgroundColor: '#EEE', marginVertical: 12 },
  modalButtons: { flexDirection: 'row', marginTop: 20, gap: 10 },
  btnCancel: { flex: 1, alignItems: 'center', padding: 15 },
  btnCancelText: { color: '#888', fontWeight: '600' },
  btnSave: { flex: 2, backgroundColor: Colors.primary, borderRadius: 15, alignItems: 'center', padding: 15 },
  btnSaveText: { color: '#FFF', fontWeight: 'bold', fontSize: 16 }
});