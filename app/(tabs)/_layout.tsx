import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../../constants/theme';

export default function TabLayout() {
  return (
    <Tabs screenOptions={{
      tabBarActiveTintColor: Colors.primary,
      headerShown: false,
    }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Produits',
          tabBarIcon: ({ color }) => <Ionicons name="wine" size={24} color={color} />,
        }}
      />
      {/* Ajoute tes autres écrans ici (transactions, profile) */}
    </Tabs>
  );
}