import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { useTheme } from '../theme/ThemeContext';

export default function BackHeader({ title }){
  const navigation = useNavigation();
  const { colors } = useTheme();
  return (
    <View style={[styles.wrap, { borderBottomColor: colors.border }]}> 
      <View style={styles.inner}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.btn}>
          <Feather name="chevron-left" size={20} color={colors.primary} />
        </TouchableOpacity>
        <Text style={[styles.title, { color: colors.text }]} numberOfLines={1}>{title}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { padding: 8, borderBottomWidth: 1 },
  inner: { flexDirection: 'row', alignItems: 'center' },
  btn: { padding: 8 },
  title: { fontWeight: '800', fontSize: 16, marginLeft: 6 },
});
