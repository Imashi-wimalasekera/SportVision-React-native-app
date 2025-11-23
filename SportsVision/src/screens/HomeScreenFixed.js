// Clean HomeScreen (fixed file)
import React, { useEffect, useState } from 'react';
import { View, Text, ActivityIndicator, StyleSheet, TouchableOpacity, Alert, TextInput, ScrollView, FlatList } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { Feather } from '@expo/vector-icons';
import { fetchTeamsByLeague, fetchPlayersByTeam, fetchUpcomingEventsByTeam, fetchTeamsFromLeagues } from '../api/sportsApi';
import DEFAULT_LEAGUES from '../config/leagues';
import ImageWithFallback from '../components/ImageWithFallback';
import { useNavigation } from '@react-navigation/native';
import { useSelector, useDispatch } from 'react-redux';
import { toggleFavourite, persistFavourites } from '../store/favouritesSlice';
import { useTheme } from '../theme/ThemeContext';
import Logo from '../components/Logo';
import HeaderBar from '../components/HeaderBar';

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
        // fetch from configured top leagues and merge with sample teams to ensure at least 12
        const leagues = DEFAULT_LEAGUES;
        const allTeams = await fetchTeamsFromLeagues(leagues);
        const fetchedUnique = (allTeams && allTeams.length) ? allTeams : (await fetchTeamsByLeague(DEFAULT_LEAGUES[0]));
        // dedupe fetched and sample teams and fill up to 12
        const dedupeMap = new Map();
        const pushIfNew = (t) => {
          const id = t && (t.idTeam || t.id);
          const name = t && (t.strTeam || t.name || '').trim();
          const key = id || name;
          if (!key) return;
          if (!dedupeMap.has(key)) dedupeMap.set(key, t);
        };
        (fetchedUnique || []).forEach(pushIfNew);
        // then add sampleTeams to fill any gaps
        sampleTeams.forEach(pushIfNew);
        const finalTeams = Array.from(dedupeMap.values()).slice(0, 12);
        setTeams(finalTeams);
        // Fetch players and upcoming events across the top teams to populate richer lists
        const topTeams = finalTeams.slice(0, 6);
        if (topTeams.length) {
          let playersAcc = [];
          let matchesAcc = [];
          await Promise.all(topTeams.map(async (tm) => {
            const [p, ev] = await Promise.all([
              fetchPlayersByTeam(tm.idTeam).catch(() => []),
              fetchUpcomingEventsByTeam(tm.idTeam).catch(() => []),
            ]);
            if (p && p.length) playersAcc = playersAcc.concat(p);
            if (ev && ev.length) matchesAcc = matchesAcc.concat(ev);
          }));

          const dedupeBy = (arr, key) => {
            const map = new Map();
            (arr || []).forEach(item => {
              const k = item && (item[key] || item.id || item.idPlayer || item.idEvent);
              if (k && !map.has(k)) map.set(k, item);
            });
            return Array.from(map.values());
          };

          playersAcc = dedupeBy(playersAcc, 'idPlayer').slice(0, 36);
          matchesAcc = dedupeBy(matchesAcc, 'idEvent').slice(0, 24);

          setPlayers(playersAcc);
          setMatches(matchesAcc);
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

  const sampleTeams = [
    { idTeam: '1', strTeam: 'Red Warriors', strLeague: 'Premier League', strTeamBadge: 'https://via.placeholder.com/80x80.png?text=RW' },
    { idTeam: '2', strTeam: 'Blue Strikers', strLeague: 'Championship', strTeamBadge: 'https://via.placeholder.com/80x80.png?text=BS' },
    { idTeam: '3', strTeam: 'Green United', strLeague: 'Premier League', strTeamBadge: 'https://via.placeholder.com/80x80.png?text=GU' },
    { idTeam: '4', strTeam: 'Yellow Tigers', strLeague: 'League One', strTeamBadge: 'https://via.placeholder.com/80x80.png?text=YT' },
    { idTeam: '5', strTeam: 'Black Panthers', strLeague: 'Premier League', strTeamBadge: 'https://via.placeholder.com/80x80.png?text=BP' },
    { idTeam: '6', strTeam: 'White Falcons', strLeague: 'Championship', strTeamBadge: 'https://via.placeholder.com/80x80.png?text=WF' },
    { idTeam: '7', strTeam: 'Orange City', strLeague: 'League Two', strTeamBadge: 'https://via.placeholder.com/80x80.png?text=OC' },
    { idTeam: '8', strTeam: 'Silver Stars', strLeague: 'Premier League', strTeamBadge: 'https://via.placeholder.com/80x80.png?text=SS' },
    { idTeam: '9', strTeam: 'Golden Eagles', strLeague: 'Premier League', strTeamBadge: 'https://via.placeholder.com/80x80.png?text=GE' },
    { idTeam: '10', strTeam: 'City United', strLeague: 'Championship', strTeamBadge: 'https://via.placeholder.com/80x80.png?text=CU' },
    { idTeam: '11', strTeam: 'Coastal Rovers', strLeague: 'League One', strTeamBadge: 'https://via.placeholder.com/80x80.png?text=CR' },
    { idTeam: '12', strTeam: 'Mountain FC', strLeague: 'League Two', strTeamBadge: 'https://via.placeholder.com/80x80.png?text=MF' },
  ];

  const dummyTeams = (teams && teams.length) ? teams : sampleTeams;

  const dummyPlayers = players.length ? players : [
    { idPlayer: 'p1', strPlayer: 'Liam Smith', strTeam: 'Red Warriors', strPosition: 'Forward', strThumb: 'https://via.placeholder.com/90x90.png?text=LS' },
  ];

  const dummyMatches = matches.length ? matches : [
    { idEvent: 'm1', strEvent: 'Red Warriors vs Blue Strikers', strLeague: 'Premier League', dateEvent: '2025-11-25', strTime: '18:30:00' }
  ];

  if (loading) return <View style={[styles.center, { backgroundColor: colors.background }]}><ActivityIndicator size="large" color={colors.primary} /></View>;

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background, paddingTop: insets.top + 4 }]}> 
      <HeaderBar title="SportsVision" showBack={false} showBell={true} showProfile={true} />

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
                      <SectionHeader title="Popular Teams" onViewAll={() => navigation.navigate('Teams', { league: 'English Premier League' })} />
            <FlatList data={dummyTeams} horizontal showsHorizontalScrollIndicator={false} keyExtractor={(i) => i.idTeam} renderItem={({ item }) => (
              <TeamSmallCard team={item} onPress={() => onPress(item)} onToggleFav={() => onToggleFav(item)} isFav={!!favourites.find(f => f.idTeam === item.idTeam)} />
            )} style={{ marginVertical: 8 }} />

            <SectionHeader title="Top Players" onViewAll={() => navigation.navigate('Players', { league: 'English Premier League' })} />
            <FlatList data={dummyPlayers} horizontal showsHorizontalScrollIndicator={false} keyExtractor={(i) => i.idPlayer || i.id} renderItem={({ item }) => (
              <PlayerCard player={item} />
            )} style={{ marginVertical: 8 }} />

            <SectionHeader title="Upcoming Matches" onViewAll={() => navigation.navigate('Matches', { league: 'English Premier League' })} />
            {dummyMatches.map(m => (
              <MatchCard key={m.idEvent || m.id} match={m} />
            ))}

            <TouchableOpacity onPress={() => {
              const teamIds = (teams || []).slice(0,6).map(t => t.idTeam).filter(Boolean);
              navigation.navigate('Matches', { league: 'English Premier League', teamIds });
            }} style={[styles.wideCard, styles.smallCardElevated, { backgroundColor: colors.card, borderColor: colors.border }]}> 
              <View style={{ flex: 1 }}>
                <Text style={[styles.smallTitle, { color: colors.text, fontSize: 16 }]}>View All Matches (Top Teams)</Text>
                <Text style={[styles.smallDesc, { color: colors.muted }]}>See upcoming matches from top teams.</Text>
              </View>
              <View style={{ justifyContent: 'center', marginLeft: 12 }}>
                <Feather name="chevron-right" size={20} color={colors.muted} />
              </View>
            </TouchableOpacity>
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

function TeamSmallCard({ team, onPress, onToggleFav, isFav }){
  const { colors } = useTheme();
  return (
    <TouchableOpacity onPress={() => onPress(team)} style={[styles.smallCard, styles.smallCardElevated, { backgroundColor: colors.card, borderColor: colors.border }]}> 
      <ImageWithFallback uri={team.strTeamBadge} size={72} alt={team.strTeam} style={{ marginBottom: 8 }} />
      <Text style={[styles.smallTitle, { color: colors.text }]} numberOfLines={1}>{team.strTeam}</Text>
      <Text style={[styles.smallDesc, { color: colors.muted }]} numberOfLines={1}>{team.strLeague}</Text>
      <View style={styles.rowBottom}>
        <View style={styles.badge}><Text style={{ color: '#fff', fontSize: 11 }}>Popular</Text></View>
        {typeof onToggleFav === 'function' ? (
          <TouchableOpacity onPress={() => onToggleFav(team)} style={styles.favBtn}>
            <Feather name={isFav ? 'heart' : 'heart'} size={16} color={isFav ? '#ef4444' : '#9ca3af'} />
          </TouchableOpacity>
        ) : null}
      </View>
    </TouchableOpacity>
  );
}

function PlayerCard({ player }){
  const { colors } = useTheme();
  return (
    <View style={[styles.playerCard, styles.playerCardElevated, { backgroundColor: colors.card, borderColor: colors.border }]}> 
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
    <View style={[styles.matchCard, styles.matchCardElevated, { backgroundColor: colors.card, borderColor: colors.border }]}> 
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
  header: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 12, paddingVertical: 6, borderBottomWidth: 1, justifyContent: 'space-between' },
  headerLeft: { flexDirection: 'row', alignItems: 'center' },
  headerRight: { flexDirection: 'row', alignItems: 'center' },
  headerTitle: { fontSize: 18, fontWeight: '700', marginLeft: 6 },
  iconButton: { marginLeft: 10, padding: 4 },
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
  smallCard: { width: 120, padding: 10, marginHorizontal: 6, borderWidth: 1, borderRadius: 12, alignItems: 'center', marginRight: 10 },
  smallCardElevated: { shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.08, shadowRadius: 6, elevation: 3 },
  rowBottom: { width: '100%', marginTop: 8, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  favBtn: { padding: 6 },
  smallAvatar: { width: 72, height: 72, resizeMode: 'contain', marginBottom: 8 },
  smallTitle: { fontWeight: '700' },
  smallDesc: { fontSize: 12, marginTop: 4 },
  badge: { position: 'absolute', top: 8, right: 8, backgroundColor: '#f97316', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 10 },
  wideCard: { width: '100%', padding: 14, borderWidth: 1, borderRadius: 12, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 12 },
  playerCard: { width: 120, padding: 10, marginHorizontal: 6, borderWidth: 1, borderRadius: 12, alignItems: 'center' },
  playerCardElevated: { shadowColor: '#000', shadowOffset: { width: 0, height: 6 }, shadowOpacity: 0.1, shadowRadius: 8, elevation: 4 },
  playerAvatar: { width: 84, height: 84, borderRadius: 42, marginBottom: 8 },
  playerName: { fontWeight: '800' },
  playerBadge: { marginTop: 8, backgroundColor: '#10b981', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 8 },
  matchCard: { flexDirection: 'row', alignItems: 'center', padding: 12, borderWidth: 1, borderRadius: 12, marginTop: 12 },
  matchCardElevated: { shadowColor: '#000', shadowOffset: { width: 0, height: 3 }, shadowOpacity: 0.06, shadowRadius: 4, elevation: 2 },
  matchRow: { width: 68, justifyContent: 'center', alignItems: 'center' },
  matchBadge: { width: 40, height: 40, resizeMode: 'contain', marginBottom: 4 },
  matchTitle: { fontWeight: '800' },
  matchStatus: { backgroundColor: '#3b82f6', paddingHorizontal: 8, paddingVertical: 6, borderRadius: 8, marginLeft: 8 },
  resultRow: { padding: 12, borderWidth: 1, borderRadius: 10, marginTop: 8 },
});
