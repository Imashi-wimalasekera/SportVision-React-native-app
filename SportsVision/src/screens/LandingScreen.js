import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import Logo from '../components/Logo';
import { useTheme } from '../theme/ThemeContext';

export default function LandingScreen({ navigation }) {
  const { colors } = useTheme();

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}> 
      <Logo size={140} />
      <Text style={[styles.appName, { color: colors.text }]}>SportsVision</Text>
      <Text style={[styles.tagline, { color: colors.muted }]}>Explore, Play, Discover</Text>

      <TouchableOpacity style={[styles.button, { backgroundColor: colors.primary }]} onPress={() => navigation.navigate('Auth')}>
        <Text style={styles.buttonText}>Get Started</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 24 },
  appName: { fontSize: 34, fontWeight: '900', marginTop: 18 },
  tagline: { fontSize: 16, marginTop: 8, marginBottom: 24 },
  button: { paddingHorizontal: 28, paddingVertical: 14, borderRadius: 12 },
  buttonText: { color: '#fff', fontWeight: '800' },
});
