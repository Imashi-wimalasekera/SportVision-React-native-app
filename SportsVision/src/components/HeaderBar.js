import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Feather } from '@expo/vector-icons';
import Logo from './Logo';
import { useTheme } from '../theme/ThemeContext';

export default function HeaderBar({ title = 'SportsVision', showBack = false, onMarkRead, showProfile = true, showBell = true }){
  const navigation = useNavigation();
  const { colors } = useTheme();

  const goToProfile = () => navigation.navigate && navigation.navigate('Profile');
  const goToNotifications = () => navigation.navigate && navigation.navigate('Notifications');

  return (
    <View style={[styles.header, { borderBottomColor: colors.border }]}> 
      <View style={styles.headerLeft}>
        {showBack ? (
          <TouchableOpacity onPress={() => navigation.goBack && navigation.goBack()} style={{ padding: 6 }}>
            <Text style={[styles.backChevron, { color: colors.text }]}>‹</Text>
          </TouchableOpacity>
        ) : (
          <Logo size={32} />
        )}
        <Text style={[styles.headerTitle, { color: colors.text }]}>{title}</Text>
      </View>

      <View style={styles.headerRight}>
        {showBell ? (
          <TouchableOpacity onPress={goToNotifications} style={styles.iconButton}>
            <Feather name="bell" size={20} color={colors.muted} />
          </TouchableOpacity>
        ) : null}

        {showProfile ? (
          <TouchableOpacity onPress={goToProfile} style={styles.iconButton}>
            <Feather name="user" size={20} color={colors.muted} />
          </TouchableOpacity>
        ) : null}

        {typeof onMarkRead === 'function' ? (
          <TouchableOpacity onPress={onMarkRead} style={styles.markReadBtn}>
            <Text style={{ color: '#00C48C', fontWeight: '700' }}>Mark as read</Text>
          </TouchableOpacity>
        ) : null}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  header: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 12, paddingVertical: 6, borderBottomWidth: 1, justifyContent: 'space-between' },
  headerLeft: { flexDirection: 'row', alignItems: 'center' },
  headerRight: { flexDirection: 'row', alignItems: 'center' },
  headerTitle: { fontSize: 18, fontWeight: '700', marginLeft: 6 },
  iconButton: { marginLeft: 10, padding: 4 },
  backChevron: { fontSize: 28, lineHeight: 28 },
  markReadBtn: { marginLeft: 8 },
});
