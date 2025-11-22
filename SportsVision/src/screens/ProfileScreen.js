import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../store/authSlice';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useTheme } from '../theme/ThemeContext';

export default function ProfileScreen() {
  const user = useSelector((s) => s.auth.user);
  const dispatch = useDispatch();
  const { dark, toggle, colors } = useTheme();

  const onLogout = async () => {
    await AsyncStorage.removeItem('@sv_user');
    dispatch(logout());
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={[styles.profileCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
        <View style={[styles.avatarCircle, { backgroundColor: colors.primary }]}>
          <Feather name="user" size={32} color="#fff" />
        </View>
        <Text style={[styles.username, { color: colors.text }]}>{user?.username || 'Player'}</Text>
        <Text style={[styles.subtitle, { color: colors.muted }]}>Sports Enthusiast</Text>
      </View>

      <View style={styles.actionsContainer}>
        <TouchableOpacity style={[styles.button, { backgroundColor: colors.card, borderColor: colors.border }]} onPress={toggle}>
          <Feather name={dark ? 'moon' : 'sun'} size={20} color={colors.primary} />
          <View style={{ flex: 1, marginLeft: 12 }}>
            <Text style={[styles.buttonLabel, { color: colors.text }]}>{dark ? 'Dark Mode' : 'Light Mode'}</Text>
            <Text style={[styles.buttonDesc, { color: colors.muted }]}>Switch theme</Text>
          </View>
          <Feather name="chevron-right" size={20} color={colors.muted} />
        </TouchableOpacity>

        <TouchableOpacity style={[styles.button, { backgroundColor: colors.card, borderColor: colors.border }]} onPress={onLogout}>
          <Feather name="log-out" size={20} color="#ef4444" />
          <View style={{ flex: 1, marginLeft: 12 }}>
            <Text style={[styles.buttonLabel, { color: colors.text }]}>Logout</Text>
            <Text style={[styles.buttonDesc, { color: colors.muted }]}>Sign out from account</Text>
          </View>
          <Feather name="chevron-right" size={20} color={colors.muted} />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  profileCard: { borderRadius: 16, padding: 20, alignItems: 'center', marginBottom: 28, borderWidth: 1 },
  avatarCircle: { width: 80, height: 80, borderRadius: 40, justifyContent: 'center', alignItems: 'center', marginBottom: 12 },
  username: { fontSize: 22, fontWeight: '800', marginBottom: 4 },
  subtitle: { fontSize: 14 },
  actionsContainer: { gap: 12 },
  button: { flexDirection: 'row', paddingHorizontal: 16, paddingVertical: 14, borderRadius: 12, alignItems: 'center', borderWidth: 1 },
  buttonLabel: { fontSize: 16, fontWeight: '700' },
  buttonDesc: { fontSize: 12, marginTop: 2 },
});
