import React from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../store/authSlice';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useTheme } from '../theme/ThemeContext';

export default function ProfileScreen() {
  const user = useSelector((s) => s.auth.user);
  const dispatch = useDispatch();
  const { dark, toggle } = useTheme();

  const onLogout = async () => {
    await AsyncStorage.removeItem('@sv_user');
    dispatch(logout());
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome, {user?.username || 'Player'}</Text>
      <View style={{ height: 8 }} />
      <Button title={dark ? 'Disable Dark Mode' : 'Enable Dark Mode'} onPress={toggle} />
      <View style={{ height: 8 }} />
      <Button title="Logout" onPress={onLogout} />
    </View>
  );
}

const styles = StyleSheet.create({ container: { flex: 1, padding: 16 }, title: { fontSize: 18, fontWeight: '700' } });
