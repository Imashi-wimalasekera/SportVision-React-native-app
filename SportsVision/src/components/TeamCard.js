import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useTheme } from '../theme/ThemeContext';
import ImageWithFallback from './ImageWithFallback';

export default function TeamCard({ team, onPress, isFav, onToggleFav }) {
  const { colors } = useTheme();
  return (
    <TouchableOpacity style={[styles.card, { borderColor: colors.border, backgroundColor: colors.card }]} onPress={() => onPress(team)}>
      <ImageWithFallback uri={team.strTeamBadge} size={56} alt={team.strTeam} style={{ marginRight: 12 }} />
      <View style={styles.content}>
        <Text style={[styles.title, { color: colors.text }]}>{team.strTeam}</Text>
        <Text numberOfLines={2} style={[styles.desc, { color: colors.muted }]}>{team.strStadium || team.strLeague}</Text>
      </View>
      <TouchableOpacity onPress={() => onToggleFav(team)} style={styles.icon}>
        <Feather name={'heart'} color={isFav ? colors.accent : colors.muted} size={20} />
      </TouchableOpacity>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: { flexDirection: 'row', padding: 12, alignItems: 'center', borderBottomWidth: 1, borderColor: '#eee', borderRadius: 10, marginVertical: 6, marginHorizontal: 2, elevation: 2 },
  content: { flex: 1 },
  title: { fontWeight: '600' },
  desc: { color: '#666', marginTop: 4 },
  icon: { padding: 8 },
});
