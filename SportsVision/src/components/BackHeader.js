import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { useTheme } from '../theme/ThemeContext';

export default function BackHeader({ title, rightText, onRightPress }){
  const navigation = useNavigation();
  const { colors } = useTheme();
  return (
    <View style={[styles.wrap, { borderBottomColor: colors.border }]}> 
      <View style={styles.inner}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.leftBtn}>
          <Feather name="chevron-left" size={20} color={colors.primary} />
        </TouchableOpacity>

        <Text style={[styles.title, { color: colors.text }]} numberOfLines={1}>{title}</Text>

        {rightText ? (
          <TouchableOpacity onPress={onRightPress} style={styles.rightBtn}>
            <Text style={[styles.rightText, { color: '#00C48C' }]}>{rightText}</Text>
          </TouchableOpacity>
        ) : null}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { padding: 8, borderBottomWidth: 1 },
  inner: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', position: 'relative' },
  leftBtn: { position: 'absolute', left: 0, padding: 8 },
  rightBtn: { position: 'absolute', right: 0, padding: 8 },
  title: { fontWeight: '900', fontSize: 20 },
  rightText: { fontWeight: '700', fontSize: 13 },
});
