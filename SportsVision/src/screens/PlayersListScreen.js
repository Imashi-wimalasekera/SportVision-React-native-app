import React, { useEffect, useState, useCallback, useRef } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import { View, Text, ActivityIndicator, StyleSheet, FlatList, TouchableOpacity, Modal } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Feather } from '@expo/vector-icons';
import { useTheme } from '../theme/ThemeContext';
import { fetchTeamsByLeague, fetchPlayersByTeam, fetchTeamsFromLeagues } from '../api/sportsApi';
import AsyncStorage from '@react-native-async-storage/async-storage';
import ImageWithFallback from '../components/ImageWithFallback';
import { useNavigation, useRoute } from '@react-navigation/native';
import BackHeader from '../components/BackHeader';

export default function PlayersListScreen(){
  const { colors } = useTheme();
  const navigation = useNavigation();
  const route = useRoute();
  const leagueParam = route.params?.league || null;

  const [league, setLeague] = useState(leagueParam || 'English Premier League');
  const [teams, setTeams] = useState([]);
  const [teamsIndex, setTeamsIndex] = useState(0);
  const [playersAcc, setPlayersAcc] = useState([]);
  const [visible, setVisible] = useState([]);
  const [loading, setLoading] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const PAGE_SIZE = 16;

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
    setPlayersAcc([]);
    setVisible([]);
    setTeamsIndex(0);
    try {
      // If a league param is given, use it. Otherwise fetch across persisted selected leagues.
      let topTeams = [];
      if (leagueParam) {
        const t = await fetchTeamsByLeague(league);
        topTeams = (t || []).slice(0, 12);
      } else {
        const raw = await AsyncStorage.getItem('@sv_selected_leagues').catch(() => null);
        const leagues = raw ? JSON.parse(raw) : ['English Premier League'];
        console.debug && console.debug('[Players] loading teams for leagues:', leagues);
        const t = await fetchTeamsFromLeagues(leagues);
        topTeams = (t || []).slice(0, 12);
      }
      console.debug && console.debug('[Players] topTeams count:', topTeams.length);
      setTeams(topTeams);
      // fetch initial players for first 2 teams
      await fetchPlayersForNextTeams(2, topTeams, 0);
    } catch (e) {
      setTeams([]);
    } finally { setLoading(false); }
  };

  const dedupeBy = (arr, key) => {
    const map = new Map();
    (arr || []).forEach(item => {
      if (!item) return;
      const k = item[key] || item.id || item.idPlayer || item.idEvent || `${item.strPlayer}-${item.strTeam}`;
      if (k && !map.has(k)) map.set(k, item);
    });
    return Array.from(map.values());
  };

  const fetchPlayersForNextTeams = async (count = 1, fromTeams = teams, startIndex = teamsIndex) => {
    if (!fromTeams || startIndex >= fromTeams.length) return;
    const slice = fromTeams.slice(startIndex, startIndex + count);
    let acc = [];
    await Promise.all(slice.map(async (tm) => {
      const p = await fetchPlayersByTeam(tm.idTeam).catch(() => []);
      console.debug && console.debug('[Players] fetched for team', tm.strTeam || tm.name, '->', (p && p.length) || 0);
      if (p && p.length) acc = acc.concat(p);
    }));
    const merged = dedupeBy(playersAcc.concat(acc), 'idPlayer');
    setPlayersAcc(merged);
    // ensure visible has at least PAGE_SIZE
    setVisible(v => {
      const current = v && v.length ? v : merged.slice(0, PAGE_SIZE);
      return current;
    });
    setTeamsIndex(startIndex + slice.length);
  };

  const loadMore = useCallback(async () => {
    // if we have more fetched players not yet visible, reveal them
    if (visible.length < playersAcc.length) {
      const next = playersAcc.slice(visible.length, visible.length + PAGE_SIZE);
      setVisible(v => v.concat(next));
      return;
    }
    // otherwise, fetch players from the next team
    if (teamsIndex < teams.length) {
      setLoading(true);
      await fetchPlayersForNextTeams(1, teams, teamsIndex);
      setLoading(false);
    }
  }, [visible, playersAcc, teamsIndex, teams]);

  const renderItem = ({ item }) => (
    <TouchableOpacity style={[styles.row, { backgroundColor: colors.card, borderColor: colors.border }]} onPress={() => navigation.navigate('Details', { id: item.idPlayer || item.id, player: item })}>
      <ImageWithFallback uri={item.strThumb || item.strCutout || item.image} size={56} alt={item.strPlayer || item.name} />
      <View style={{ marginLeft: 12, flex: 1 }}>
        <Text style={[styles.title, { color: colors.text }]} numberOfLines={1}>{item.strPlayer || item.name}</Text>
        <Text style={[styles.sub, { color: colors.muted }]} numberOfLines={1}>{item.strTeam || item.team} • {item.strPosition || item.position}</Text>
      </View>
    </TouchableOpacity>
  );

  const LEAGUES = ['English Premier League', 'La Liga', 'Serie A', 'Bundesliga'];
  const SkeletonRow = () => (
    <View style={[styles.row, { backgroundColor: colors.card, borderColor: colors.card }]}> 
      <View style={{ width: 56, height: 56, borderRadius: 28, backgroundColor: colors.muted }} />
      <View style={{ marginLeft: 12, flex: 1 }}>
        <View style={{ height: 14, width: '50%', backgroundColor: colors.muted, borderRadius: 6, marginBottom: 6 }} />
        <View style={{ height: 12, width: '35%', backgroundColor: colors.muted, borderRadius: 6 }} />
      </View>
    </View>
  );
  const samplePlayers = [
    { idPlayer: 'sp1', strPlayer: 'Liam Smith', strTeam: 'Sample United', strPosition: 'Forward' },
    { idPlayer: 'sp2', strPlayer: 'Noah Brown', strTeam: 'Example FC', strPosition: 'Midfield' },
  ];

  return (
    <View style={[styles.container, { backgroundColor: colors.background, paddingTop: insets.top + 8 }]}> 
      <BackHeader title={`Players — ${league.split(' ')[0]}`} />

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
        // Show sample players only when no real players were fetched.
        (playersAcc && playersAcc.length === 0) ? (
          <View style={{ padding: 12 }}>
            {samplePlayers.map(p => (
              <React.Fragment key={p.idPlayer}>
                {renderItem({ item: p })}
              </React.Fragment>
            ))}
          </View>
        ) : (
          <FlatList data={visible} renderItem={renderItem} keyExtractor={(i) => i.idPlayer || i.id} onEndReached={loadMore} onEndReachedThreshold={0.5} contentContainerStyle={{ padding: 12 }} />
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
