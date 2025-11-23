import React, { useEffect, useState, useCallback } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import { View, Text, ActivityIndicator, StyleSheet, FlatList, TouchableOpacity, Modal } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme } from '../theme/ThemeContext';
import { fetchTeamsByLeague, fetchUpcomingEventsByTeam, fetchTeamsFromLeagues } from '../api/sportsApi';
import AsyncStorage from '@react-native-async-storage/async-storage';
import ImageWithFallback from '../components/ImageWithFallback';
import { useNavigation, useRoute } from '@react-navigation/native';
import { Feather } from '@expo/vector-icons';
import BackHeader from '../components/BackHeader';

export default function MatchesListScreen(){
  const { colors } = useTheme();
  const navigation = useNavigation();
  const route = useRoute();
  const leagueParam = route.params?.league || null;

  const [league, setLeague] = useState(leagueParam || 'English Premier League');
  const [teams, setTeams] = useState([]);
  const [teamsIndex, setTeamsIndex] = useState(0);
  const [matchesAcc, setMatchesAcc] = useState([]);
  const [visible, setVisible] = useState([]);
  const [loading, setLoading] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const PAGE_SIZE = 12;

  useEffect(() => { resetAndLoad(); }, [league]);
  useFocusEffect(
    useCallback(() => {
      resetAndLoad();
    }, [league])
  );
  const insets = useSafeAreaInsets();

  const resetAndLoad = async () => {
    setLoading(true);
    setTeams([]);
    setMatchesAcc([]);
    setVisible([]);
    setTeamsIndex(0);
    try {
      let topTeams = [];
      if (leagueParam) {
        const t = await fetchTeamsByLeague(league);
        topTeams = (t || []).slice(0, 12);
      } else {
        const raw = await AsyncStorage.getItem('@sv_selected_leagues').catch(() => null);
        const leagues = raw ? JSON.parse(raw) : ['English Premier League'];
        console.debug && console.debug('[Matches] loading teams for leagues:', leagues);
        const t = await fetchTeamsFromLeagues(leagues);
        topTeams = (t || []).slice(0, 12);
      }
      console.debug && console.debug('[Matches] topTeams count:', topTeams.length);
      setTeams(topTeams);
      await fetchMatchesForNextTeams(2, topTeams, 0);
    } catch (e) {
      setTeams([]);
    } finally { setLoading(false); }
  };

  const dedupeBy = (arr, key) => {
    const map = new Map();
    (arr || []).forEach(item => {
      if (!item) return;
      const k = item[key] || item.id || item.idEvent || `${item.strEvent}-${item.dateEvent}`;
      if (k && !map.has(k)) map.set(k, item);
    });
    return Array.from(map.values());
  };

  const fetchMatchesForNextTeams = async (count = 1, fromTeams = teams, startIndex = teamsIndex) => {
    if (!fromTeams || startIndex >= fromTeams.length) return;
    const slice = fromTeams.slice(startIndex, startIndex + count);
    let acc = [];
    await Promise.all(slice.map(async (tm) => {
      const ev = await fetchUpcomingEventsByTeam(tm.idTeam).catch(() => []);
      console.debug && console.debug('[Matches] fetched events for team', tm.strTeam || tm.name, '->', (ev && ev.length) || 0);
      if (ev && ev.length) acc = acc.concat(ev);
    }));
    const merged = dedupeBy(matchesAcc.concat(acc), 'idEvent');
    setMatchesAcc(merged);
    setVisible(v => { const current = v && v.length ? v : merged.slice(0, PAGE_SIZE); return current; });
    setTeamsIndex(startIndex + slice.length);
  };

  const loadMore = useCallback(async () => {
    if (visible.length < matchesAcc.length) {
      const next = matchesAcc.slice(visible.length, visible.length + PAGE_SIZE);
      setVisible(v => v.concat(next));
      return;
    }
    if (teamsIndex < teams.length) {
      setLoading(true);
      await fetchMatchesForNextTeams(1, teams, teamsIndex);
      setLoading(false);
    }
  }, [visible, matchesAcc, teamsIndex, teams]);

  const renderItem = ({ item }) => {
    const dt = new Date(item.dateEvent || item.datetime || Date.now());
    return (
      <TouchableOpacity style={[styles.row, { backgroundColor: colors.card, borderColor: colors.border }]} onPress={() => navigation.navigate('Details', { id: item.idEvent || item.id, match: item })}>
        <View style={{ width: 60, alignItems: 'center' }}>
          <ImageWithFallback uri={item.homeBadge || item.strThumb || item.strBadge || (item.a && item.a.badge) || (item.b && item.b.badge)} size={40} />
        </View>
        <View style={{ marginLeft: 12, flex: 1 }}>
          <Text style={[styles.title, { color: colors.text }]} numberOfLines={1}>{item.strEvent || item.title}</Text>
          <Text style={[styles.sub, { color: colors.muted }]} numberOfLines={1}>{item.strLeague || item.league} • {dt.toLocaleString()}</Text>
        </View>
        <View style={{ paddingLeft: 8 }}>
          <Feather name="chevron-right" size={18} color={colors.muted} />
        </View>
      </TouchableOpacity>
    );
  };

  const LEAGUES = ['English Premier League', 'La Liga', 'Serie A', 'Bundesliga'];
  const SkeletonRow = () => (
    <View style={[styles.row, { backgroundColor: colors.card, borderColor: colors.card }]}> 
      <View style={{ width: 40, height: 40, borderRadius: 6, backgroundColor: colors.muted }} />
      <View style={{ marginLeft: 12, flex: 1 }}>
        <View style={{ height: 14, width: '60%', backgroundColor: colors.muted, borderRadius: 6, marginBottom: 6 }} />
        <View style={{ height: 12, width: '40%', backgroundColor: colors.muted, borderRadius: 6 }} />
      </View>
    </View>
  );
  const sampleMatches = [
    { idEvent: 'sm1', strEvent: 'Sample United vs Example FC', strLeague: league, dateEvent: '2025-12-01' },
    { idEvent: 'sm2', strEvent: 'Demo Rovers vs Sample United', strLeague: league, dateEvent: '2025-12-05' },
  ];

  return (
    <View style={[styles.container, { backgroundColor: colors.background, paddingTop: insets.top + 8 }]}> 
      <BackHeader title={`Matches — ${league.split(' ')[0]}`} />

      <View style={{ padding: 12, flexDirection: 'row', justifyContent: 'flex-end' }}>
        <TouchableOpacity onPress={() => setModalOpen(true)} style={{ paddingHorizontal: 8, paddingVertical: 6, borderRadius: 8, borderWidth: 1, borderColor: colors.border }}>
          <Text style={{ color: colors.text }}>League</Text>
        </TouchableOpacity>
      </View>

      <Modal visible={modalOpen} animationType="fade" transparent onRequestClose={() => setModalOpen(false)}>
        <View style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.3)', justifyContent: 'center' }}>
          <View style={{ margin: 24, backgroundColor: colors.card, padding: 12, borderRadius: 8 }}>
            {LEAGUES.map(l => (
              <TouchableOpacity key={l} onPress={() => { setModalOpen(false); if (l !== league) setLeague(l); }} style={{ padding: 12 }}>
                <Text style={{ color: l === league ? colors.primary : colors.text }}>{l}</Text>
              </TouchableOpacity>
            ))}
            <TouchableOpacity onPress={() => setModalOpen(false)} style={{ padding: 12 }}>
              <Text style={{ color: colors.muted }}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {loading ? (
        <View style={{ padding: 12 }}>
          <SkeletonRow />
          <View style={{ height: 8 }} />
          <SkeletonRow />
          <View style={{ height: 8 }} />
          <SkeletonRow />
        </View>
      ) : (
        // Prefer showing real fetched matches. If none are available, show a friendly empty state.
        (matchesAcc && matchesAcc.length > 0) ? (
          <FlatList data={visible} renderItem={renderItem} keyExtractor={(i) => i.idEvent || i.id} onEndReached={loadMore} onEndReachedThreshold={0.5} contentContainerStyle={{ padding: 12 }} />
        ) : (
          <View style={{ padding: 12 }}>
            <Text style={{ color: colors.muted }}>No upcoming matches found for the selected leagues.</Text>
          </View>
        )
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  header: { padding: 12, borderBottomWidth: 1 },
  headerTitle: { fontWeight: '800', fontSize: 18 },
  row: { flexDirection: 'row', alignItems: 'center', padding: 12, borderWidth: 1, borderRadius: 10, marginBottom: 8 },
  title: { fontWeight: '700' },
  sub: { fontSize: 12, marginTop: 4 },
});
