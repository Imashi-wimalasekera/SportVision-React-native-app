import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { Feather } from '@expo/vector-icons';
import { useSelector, useDispatch } from 'react-redux';
import { logout, login, saveAuthToStorage } from '../store/authSlice';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useTheme } from '../theme/ThemeContext';

export default function ProfileScreen() {
  const user = useSelector((s) => s.auth.user) || {};
  const dispatch = useDispatch();
  const { dark, toggle, colors } = useTheme();
  const insets = useSafeAreaInsets();

  const [editing, setEditing] = React.useState(false);
  const [name, setName] = React.useState(user.name || '');
  const [email, setEmail] = React.useState(user.email || '');
  const [username, setUsername] = React.useState(user.username || '');

  React.useEffect(() => {
    setName(user.name || '');
    setEmail(user.email || '');
    setUsername(user.username || '');
  }, [user]);

  const onLogout = async () => {
    await AsyncStorage.removeItem('@sv_user');
    dispatch(logout());
  };

  const onSave = async () => {
    const updated = { ...(user || {}), name: name.trim(), email: email.trim(), username: username.trim() };
    dispatch(login(updated));
    await dispatch(saveAuthToStorage(updated));
    setEditing(false);
  };

  const onCancel = () => {
    setName(user.name || '');
    setEmail(user.email || '');
    setUsername(user.username || '');
    setEditing(false);
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background, paddingTop: insets.top + 4 }]}> 
      <View style={[styles.profileCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
        <View style={[styles.avatarCircle, { backgroundColor: colors.primary }]}>
          <Feather name="user" size={32} color="#fff" />
        </View>
        {!editing ? (
          <>
            <Text style={[styles.username, { color: colors.text }]}>{name || username || 'Player'}</Text>
            <Text style={[styles.subtitle, { color: colors.muted }]}>{email || 'No email set'}</Text>
          </>
        ) : (
          <View style={styles.formRow}>
            <Text style={[styles.fieldLabel, { color: colors.muted }]}>Name</Text>
            <TextInput style={[styles.fieldInput, { color: colors.text, borderColor: colors.border }]} value={name} onChangeText={setName} placeholder="Full name" placeholderTextColor={colors.muted} />
            <Text style={[styles.fieldLabel, { color: colors.muted }]}>Email</Text>
            <TextInput style={[styles.fieldInput, { color: colors.text, borderColor: colors.border }]} value={email} onChangeText={setEmail} placeholder="Email" placeholderTextColor={colors.muted} keyboardType="email-address" autoCapitalize="none" />
            <Text style={[styles.fieldLabel, { color: colors.muted }]}>Username</Text>
            <TextInput style={[styles.fieldInput, { color: colors.text, borderColor: colors.border }]} value={username} onChangeText={setUsername} placeholder="Username" placeholderTextColor={colors.muted} autoCapitalize="none" />
          </View>
        )}
      </View>

      <View style={styles.actionsContainer}>
        {!editing ? (
          <TouchableOpacity style={[styles.button, { backgroundColor: colors.card, borderColor: colors.border }]} onPress={() => setEditing(true)}>
            <Feather name="edit" size={20} color={colors.primary} />
            <View style={{ flex: 1, marginLeft: 12 }}>
              <Text style={[styles.buttonLabel, { color: colors.text }]}>Edit Profile</Text>
              <Text style={[styles.buttonDesc, { color: colors.muted }]}>Update name, email or username</Text>
            </View>
            <Feather name="chevron-right" size={20} color={colors.muted} />
          </TouchableOpacity>
        ) : (
          <View style={{ flexDirection: 'row', gap: 12 }}>
            <TouchableOpacity style={[styles.saveButton, { backgroundColor: colors.primary }]} onPress={onSave}>
              <Text style={{ color: '#fff', fontWeight: '700' }}>Save</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.cancelButton, { backgroundColor: colors.card, borderColor: colors.border }]} onPress={onCancel}>
              <Text style={{ color: colors.text, fontWeight: '700' }}>Cancel</Text>
            </TouchableOpacity>
          </View>
        )}

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
    </SafeAreaView>
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
  formRow: { width: '100%' },
  fieldLabel: { fontSize: 12, marginTop: 6 },
  fieldInput: { borderWidth: 1, borderRadius: 10, paddingHorizontal: 10, paddingVertical: 8, marginTop: 6 },
  saveButton: { paddingHorizontal: 16, paddingVertical: 12, borderRadius: 10, justifyContent: 'center', alignItems: 'center', minWidth: 100 },
  cancelButton: { paddingHorizontal: 16, paddingVertical: 12, borderRadius: 10, justifyContent: 'center', alignItems: 'center', borderWidth: 1, minWidth: 100 },
});
