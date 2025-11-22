import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, ActivityIndicator, StyleSheet } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { fetchTeamsByLeague } from '../api/sportsApi';
import TeamCard from '../components/TeamCard';
import { useNavigation } from '@react-navigation/native';
import { useSelector, useDispatch } from 'react-redux';
import { toggleFavourite, persistFavourites } from '../store/favouritesSlice';
import { useTheme } from '../theme/ThemeContext';

export default function HomeScreen() {
  const [teams, setTeams] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigation = useNavigation();
  const favourites = useSelector((s) => s.favourites.items);
  const dispatch = useDispatch();
  const { colors } = useTheme();

  useEffect(() => {
    setLoading(true);
    fetchTeamsByLeague().then((t) => {
      setTeams(t);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, []);

  useEffect(() => {
    dispatch(persistFavourites(favourites));
  }, [favourites, dispatch]);

  const onPress = (team) => navigation.navigate('Details', { id: team.idTeam, team });
  const onToggleFav = (team) => dispatch(toggleFavourite(team));

  if (loading) return <View style={[styles.center, { backgroundColor: colors.background }]}><ActivityIndicator size="large" color={colors.primary} /></View>;

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={[styles.header, { borderBottomColor: colors.border }]}>
        <Feather name="list" size={24} color={colors.primary} />
        <Text style={[styles.headerTitle, { color: colors.text }]}>Teams</Text>
      </View>
      <FlatList data={teams} keyExtractor={(i) => i.idTeam} renderItem={({ item }) => (
        <TeamCard team={item} onPress={onPress} onToggleFav={onToggleFav} isFav={!!favourites.find(f => f.idTeam === item.idTeam)} />
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
});
