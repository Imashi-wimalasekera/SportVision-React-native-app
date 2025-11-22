import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { Feather } from '@expo/vector-icons';

export default function TeamCard({ team, onPress, isFav, onToggleFav }) {
  return (
    <TouchableOpacity style={styles.card} onPress={() => onPress(team)}>
      {team.strTeamBadge ? (
        <Image source={{ uri: team.strTeamBadge }} style={styles.avatar} />
      ) : (
        <View style={styles.avatarPlaceholder} />
      )}
      <View style={styles.content}>
        <Text style={styles.title}>{team.strTeam}</Text>
        <Text numberOfLines={2} style={styles.desc}>{team.strStadium || team.strLeague}</Text>
      </View>
      <TouchableOpacity onPress={() => onToggleFav(team)} style={styles.icon}>
        <Feather name={isFav ? 'heart' : 'heart'} color={isFav ? 'red' : '#666'} size={20} />
      </TouchableOpacity>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: { flexDirection: 'row', padding: 12, alignItems: 'center', borderBottomWidth: 1, borderColor: '#eee' },
  avatar: { width: 56, height: 56, resizeMode: 'contain', marginRight: 12 },
  avatarPlaceholder: { width: 56, height: 56, backgroundColor: '#ddd', marginRight: 12 },
  content: { flex: 1 },
  title: { fontWeight: '600' },
  desc: { color: '#666', marginTop: 4 },
  icon: { padding: 8 },
});
