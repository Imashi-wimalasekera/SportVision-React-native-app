import React from 'react';
import { View, FlatList, Text, StyleSheet } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useSelector } from 'react-redux';
import TeamCard from '../components/TeamCard';
import { useNavigation } from '@react-navigation/native';
import { useDispatch } from 'react-redux';
import { toggleFavourite } from '../store/favouritesSlice';
import { useTheme } from '../theme/ThemeContext';

export default function FavouritesScreen() {
  const favourites = useSelector((s) => s.favourites.items);
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const { colors } = useTheme();

  const onPress = (team) => navigation.navigate('Details', { id: team.idTeam, team });

  if (!favourites || favourites.length === 0) {
    return (
      <View style={[styles.center, { backgroundColor: colors.background }]}>
        <Feather name="heart" size={48} color={colors.muted} />
        <Text style={[styles.emptyText, { color: colors.text }]}>No favourites yet</Text>
        <Text style={[styles.emptySubtext, { color: colors.muted }]}>Add teams to your favourites</Text>
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={[styles.header, { borderBottomColor: colors.border }]}>
        <Feather name="heart" size={24} color={colors.accent} />
        <Text style={[styles.headerTitle, { color: colors.text }]}>Favourites</Text>
      </View>
      <FlatList data={favourites} keyExtractor={(i) => i.idTeam} renderItem={({ item }) => (
        <TeamCard team={item} onPress={onPress} isFav onToggleFav={() => dispatch(toggleFavourite(item))} />
      )} contentContainerStyle={styles.listContent} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  header: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, paddingVertical: 12, borderBottomWidth: 1 },
  headerTitle: { fontSize: 20, fontWeight: '700', marginLeft: 12 },
  listContent: { paddingVertical: 8 },
  emptyText: { fontSize: 18, fontWeight: '700', marginTop: 16 },
  emptySubtext: { fontSize: 14, marginTop: 8 },
});
