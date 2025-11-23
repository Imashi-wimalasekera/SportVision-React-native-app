// Clean HomeScreen (fixed file)
import React, { useEffect, useState } from 'react';
import { View, Text, ActivityIndicator, StyleSheet, TouchableOpacity, Alert, TextInput, ScrollView, FlatList } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { Feather } from '@expo/vector-icons';
import { fetchTeamsByLeague, fetchPlayersByTeam, fetchUpcomingEventsByTeam } from '../api/sportsApi';
import ImageWithFallback from '../components/ImageWithFallback';
import { useNavigation } from '@react-navigation/native';
import { useSelector, useDispatch } from 'react-redux';
import { toggleFavourite, persistFavourites } from '../store/favouritesSlice';
import { useTheme } from '../theme/ThemeContext';
import Logo from '../components/Logo';

export default function HomeScreenFixed() {
  const [teams, setTeams] = useState([]);
  const [players, setPlayers] = useState([]);
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(false);
  const [query, setQuery] = useState('');
  const [filtered, setFiltered] = useState([]);
  const navigation = useNavigation();
  const favourites = useSelector((s) => s.favourites.items);
  const dispatch = useDispatch();
  const { colors } = useTheme();

  useEffect(() => {
    setLoading(true);
    async function load() {
      try {
        const t = await fetchTeamsByLeague('English Premier League');
        setTeams((t || []).slice(0, 8));
        if (t && t[0]){
          const tm = t[0];
          const p = await fetchPlayersByTeam(tm.idTeam).catch(()=>[]);
          setPlayers((p || []).slice(0,6));
          const ev = await fetchUpcomingEventsByTeam(tm.idTeam).catch(()=>[]);
          setMatches((ev || []).slice(0,6));
        }
      } catch (e) {
        setTeams([{
          idTeam: '1', strTeam: 'Red Warriors', strLeague: 'Premier League', strTeamBadge: 'https://via.placeholder.com/80x80.png?text=RW'
        }]);
      } finally { setLoading(false); }
    }
    load();
  }, []);

  useEffect(() => { dispatch(persistFavourites(favourites)); }, [favourites, dispatch]);

  useEffect(() => {
    const q = query.trim().toLowerCase();
    if (!q) return setFiltered([]);
    const teamMatches = teams.filter(t => (t.strTeam || '').toLowerCase().includes(q));
    const playerMatches = players.filter(p => (p.strPlayer || p.name || '').toLowerCase().includes(q));
    setFiltered([...teamMatches, ...playerMatches]);
  }, [query, teams, players]);

  const insets = useSafeAreaInsets();

  const onPress = (team) => navigation.navigate('Details', { id: team.idTeam, team });
  const onToggleFav = (team) => dispatch(toggleFavourite(team));
  const goToProfile = () => navigation.navigate('Profile');
  const goToNotifications = () => navigation.navigate('Notifications');

  const dummyTeams = teams.length ? teams : [
    { idTeam: '1', strTeam: 'Red Warriors', strLeague: 'Premier League', strTeamBadge: 'https://via.placeholder.com/80x80.png?text=RW' },
    { idTeam: '2', strTeam: 'Blue Strikers', strLeague: 'Championship', strTeamBadge: 'https://via.placeholder.com/80x80.png?text=BS' },
  ];

  const dummyPlayers = players.length ? players : [
    { idPlayer: 'p1', strPlayer: 'Liam Smith', strTeam: 'Red Warriors', strPosition: 'Forward', strThumb: 'https://via.placeholder.com/90x90.png?text=LS' },
  ];

  const dummyMatches = matches.length ? matches : [
    { idEvent: 'm1', strEvent: 'Red Warriors vs Blue Strikers', strLeague: 'Premier League', dateEvent: '2025-11-25', strTime: '18:30:00' }
  ];

  if (loading) return <View style={[styles.center, { backgroundColor: colors.background }]}><ActivityIndicator size="large" color={colors.primary} /></View>;

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background, paddingTop: insets.top + 8 }]}> 
      <View style={[styles.header, { borderBottomColor: colors.border }]}> 
        <View style={styles.headerLeft}>
          <Logo size={36} />
          <Text style={[styles.headerTitle, { color: colors.text }]}>SportsVision</Text>
        </View>

        <View style={styles.headerRight}>
          <TouchableOpacity onPress={goToNotifications} style={styles.iconButton}>
            <Feather name="bell" size={20} color={colors.muted} />
          </TouchableOpacity>
          <TouchableOpacity onPress={goToProfile} style={styles.iconButton}>
            <Feather name="user" size={20} color={colors.muted} />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.rowBetween}>
          <Text style={[styles.greeting, { color: colors.text }]}>Hello Imashi, <Text style={styles.wave}>👋</Text></Text>
          <Text style={[styles.subtle, { color: colors.muted }]}>Good to see you</Text>
        </View>

        <View style={[styles.searchWrap, { backgroundColor: colors.card, borderColor: colors.border }]}> 
          <Feather name="search" size={18} color={colors.muted} style={{ marginHorizontal: 8 }} />
          <TextInput value={query} onChangeText={setQuery} placeholder="Search teams, players, matches" placeholderTextColor={colors.muted} style={[styles.searchInput, { color: colors.text }]} />
          {query.length > 0 ? (
            <TouchableOpacity onPress={() => setQuery('')} style={{ padding: 8 }}>
              <Feather name="x" size={16} color={colors.muted} />
            </TouchableOpacity>
          ) : null}
        </View>

        {query ? (
          <View style={{ marginTop: 12 }}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>Search Results</Text>
            {filtered.length === 0 ? <Text style={[styles.subtle, { color: colors.muted }]}>No results</Text> : (
              filtered.map((it) => (
                <View key={it.idTeam || it.idPlayer || it.id} style={[styles.resultRow, { backgroundColor: colors.card, borderColor: colors.border }]}> 
                  <Text style={{ color: colors.text }}>{it.strTeam || it.strPlayer || it.name}</Text>
                </View>
              ))
            )}
          </View>
        ) : (
          <>
            <SectionHeader title="Popular Teams" onViewAll={() => Alert.alert('View All', 'Show all popular teams')} />
            <FlatList data={dummyTeams} horizontal showsHorizontalScrollIndicator={false} keyExtractor={(i) => i.idTeam} renderItem={({ item }) => (
              <TeamSmallCard team={item} onPress={() => onPress(item)} onToggleFav={() => onToggleFav(item)} isFav={!!favourites.find(f => f.idTeam === item.idTeam)} />
            )} style={{ marginVertical: 8 }} />

            <SectionHeader title="Top Players" onViewAll={() => Alert.alert('View All', 'Show all players')} />
            <FlatList data={dummyPlayers} horizontal showsHorizontalScrollIndicator={false} keyExtractor={(i) => i.idPlayer || i.id} renderItem={({ item }) => (
              <PlayerCard player={item} />
            )} style={{ marginVertical: 8 }} />

            <SectionHeader title="Upcoming Matches" onViewAll={() => Alert.alert('View All', 'Show all matches')} />
            {dummyMatches.map(m => (
              <MatchCard key={m.idEvent || m.id} match={m} />
            ))}
          </>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

function SectionHeader({ title, onViewAll }){
  const { colors } = useTheme();
  return (
    <View style={styles.sectionHeader}>
      <Text style={[styles.sectionTitle, { color: colors.text }]}>{title}</Text>
      <TouchableOpacity onPress={onViewAll}><Text style={{ color: colors.primary, fontWeight: '700' }}>View All</Text></TouchableOpacity>
    </View>
  );
}

function TeamSmallCard({ team, onPress }){
  const { colors } = useTheme();
  return (
    <TouchableOpacity onPress={() => onPress(team)} style={[styles.smallCard, { backgroundColor: colors.card, borderColor: colors.border }]}> 
      <ImageWithFallback uri={team.strTeamBadge} size={72} alt={team.strTeam} style={{ marginBottom: 8 }} />
      <Text style={[styles.smallTitle, { color: colors.text }]} numberOfLines={1}>{team.strTeam}</Text>
      <Text style={[styles.smallDesc, { color: colors.muted }]} numberOfLines={1}>{team.strLeague}</Text>
      <View style={styles.badge}><Text style={{ color: '#fff', fontSize: 11 }}>Popular</Text></View>
    </TouchableOpacity>
  );
}

function PlayerCard({ player }){
  const { colors } = useTheme();
  return (
    <View style={[styles.playerCard, { backgroundColor: colors.card, borderColor: colors.border }]}> 
      <ImageWithFallback uri={player.strThumb || player.image} size={84} alt={player.strPlayer || player.name} style={{ marginBottom: 8 }} />
      <Text style={[styles.playerName, { color: colors.text }]} numberOfLines={1}>{player.strPlayer || player.name}</Text>
      <Text style={[styles.smallDesc, { color: colors.muted }]}>{player.strTeam || player.team} • {player.strPosition || player.position}</Text>
      <View style={styles.playerBadge}><Text style={{ color: '#fff', fontSize: 11 }}>Active Player</Text></View>
    </View>
  );
}

function MatchCard({ match }){
  const { colors } = useTheme();
  const dt = new Date(match.dateEvent || match.datetime || Date.now());
  return (
    <View style={[styles.matchCard, { backgroundColor: colors.card, borderColor: colors.border }]}> 
      <View style={styles.matchRow}>
        <ImageWithFallback uri={match.strBadge || (match.a && match.a.badge)} size={40} />
        <ImageWithFallback uri={match.strBadge || (match.b && match.b.badge)} size={40} />
      </View>
      <View style={{ flex: 1 }}>
        <Text style={[styles.matchTitle, { color: colors.text }]}>{match.strEvent || match.title}</Text>
        <Text style={[styles.smallDesc, { color: colors.muted }]}>{match.strLeague || match.league}</Text>
        <Text style={[styles.smallDesc, { color: colors.muted }]}>{dt.toLocaleString()}</Text>
      </View>
      <View style={styles.matchStatus}><Text style={{ color: '#fff', fontSize: 12 }}>Upcoming</Text></View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  header: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 12, paddingVertical: 10, borderBottomWidth: 1, justifyContent: 'space-between' },
  headerLeft: { flexDirection: 'row', alignItems: 'center' },
  headerRight: { flexDirection: 'row', alignItems: 'center' },
  headerTitle: { fontSize: 18, fontWeight: '700', marginLeft: 8 },
  iconButton: { marginLeft: 12, padding: 6 },
  listContent: { paddingVertical: 8 },
  content: { padding: 16, paddingBottom: 32 },
  rowBetween: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
  greeting: { fontSize: 20, fontWeight: '800' },
  wave: { fontSize: 20 },
  subtle: { fontSize: 13, opacity: 0.9 },
  searchWrap: { flexDirection: 'row', alignItems: 'center', borderWidth: 1, borderRadius: 12, paddingHorizontal: 6, height: 44 },
  searchInput: { flex: 1, height: '100%', paddingHorizontal: 8 },
  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 18 },
  sectionTitle: { fontSize: 16, fontWeight: '800' },
  smallCard: { width: 140, padding: 12, marginHorizontal: 8, borderWidth: 1, borderRadius: 12, alignItems: 'center', marginRight: 12 },
  smallAvatar: { width: 72, height: 72, resizeMode: 'contain', marginBottom: 8 },
  smallTitle: { fontWeight: '700' },
  smallDesc: { fontSize: 12, marginTop: 4 },
  badge: { position: 'absolute', top: 8, right: 8, backgroundColor: '#f97316', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 10 },
  playerCard: { width: 140, padding: 12, marginHorizontal: 8, borderWidth: 1, borderRadius: 12, alignItems: 'center' },
  playerAvatar: { width: 84, height: 84, borderRadius: 42, marginBottom: 8 },
  playerName: { fontWeight: '800' },
  playerBadge: { marginTop: 8, backgroundColor: '#10b981', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 8 },
  matchCard: { flexDirection: 'row', alignItems: 'center', padding: 12, borderWidth: 1, borderRadius: 12, marginTop: 12 },
  matchRow: { width: 68, justifyContent: 'center', alignItems: 'center' },
  matchBadge: { width: 40, height: 40, resizeMode: 'contain', marginBottom: 4 },
  matchTitle: { fontWeight: '800' },
  matchStatus: { backgroundColor: '#3b82f6', paddingHorizontal: 8, paddingVertical: 6, borderRadius: 8, marginLeft: 8 },
  resultRow: { padding: 12, borderWidth: 1, borderRadius: 10, marginTop: 8 },
});
