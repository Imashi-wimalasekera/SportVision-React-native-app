import React, { useEffect, useState, useCallback } from 'react';
import { View, Text, ActivityIndicator, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { useTheme } from '../theme/ThemeContext';
import { fetchTeamsByLeague, fetchUpcomingEventsByTeam } from '../api/sportsApi';
import ImageWithFallback from '../components/ImageWithFallback';
import { useNavigation, useRoute } from '@react-navigation/native';
import { Feather } from '@expo/vector-icons';

export default function MatchesListScreen(){
  const { colors } = useTheme();
  const navigation = useNavigation();
  const route = useRoute();
  const league = route.params?.league || 'English Premier League';

  const [allMatches, setAllMatches] = useState([]);
  const [visible, setVisible] = useState([]);
  const [loading, setLoading] = useState(false);
  const PAGE_SIZE = 12;

  useEffect(() => { load(); }, [league]);

  const load = async () => {
    setLoading(true);
    try {
      const teams = await fetchTeamsByLeague(league);
      const topTeams = (teams || []).slice(0, 8);
      let matchesAcc = [];
      await Promise.all(topTeams.map(async (tm) => {
        const ev = await fetchUpcomingEventsByTeam(tm.idTeam).catch(()=>[]);
        if (ev && ev.length) matchesAcc = matchesAcc.concat(ev);
      }));

      // dedupe
      const map = new Map();
      (matchesAcc || []).forEach(m => {
        const k = m.idEvent || m.id;
        if (k && !map.has(k)) map.set(k, m);
      });
      const deduped = Array.from(map.values());
      setAllMatches(deduped);
      setVisible(deduped.slice(0, PAGE_SIZE));
    } catch (e) {
      setAllMatches([]);
      setVisible([]);
    } finally { setLoading(false); }
  };

  const loadMore = useCallback(() => {
    if (visible.length >= allMatches.length) return;
    const next = allMatches.slice(visible.length, visible.length + PAGE_SIZE);
    setVisible(v => v.concat(next));
  }, [visible, allMatches]);

  const renderItem = ({ item }) => {
    const dt = new Date(item.dateEvent || item.datetime || Date.now());
    return (
      <TouchableOpacity style={[styles.row, { backgroundColor: colors.card, borderColor: colors.border }]} onPress={() => navigation.navigate('Details', { id: item.idEvent || item.id, match: item })}>
        <View style={{ width: 60, alignItems: 'center' }}>
          <ImageWithFallback uri={item.strThumb || item.strBadge || (item.a && item.a.badge)} size={40} />
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

  if (loading) return (
    <View style={[styles.center, { backgroundColor: colors.background }]}>
      <View style={[styles.header, { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }]}> 
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={{ padding: 8 }}>
            <Feather name="chevron-left" size={20} color={colors.primary} />
          </TouchableOpacity>
          <Text style={[styles.headerTitle, { color: colors.text }]}>All Matches</Text>
        </View>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          {LEAGUES.map(l => (
            <TouchableOpacity key={l} onPress={() => { if (l !== league) navigation.replace('Matches', { league: l }); }} style={{ paddingHorizontal: 8, paddingVertical: 6, marginLeft: 6, borderRadius: 8, backgroundColor: l === league ? colors.primary : 'transparent' }}>
              <Text style={{ color: l === league ? '#fff' : colors.text, fontSize: 12 }}>{l.split(' ')[0]}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>
      <View style={{ padding: 12 }}>
        <SkeletonRow />
        <View style={{ height: 8 }} />
        <SkeletonRow />
        <View style={{ height: 8 }} />
        <SkeletonRow />
      </View>
    </View>
  );

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}> 
      <View style={[styles.header, { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }]}> 
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={{ padding: 8 }}>
            <Feather name="chevron-left" size={20} color={colors.primary} />
          </TouchableOpacity>
          <Text style={[styles.headerTitle, { color: colors.text }]}>All Matches</Text>
        </View>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          {LEAGUES.map(l => (
            <TouchableOpacity key={l} onPress={() => { if (l !== league) navigation.replace('Matches', { league: l }); }} style={{ paddingHorizontal: 8, paddingVertical: 6, marginLeft: 6, borderRadius: 8, backgroundColor: l === league ? colors.primary : 'transparent' }}>
              <Text style={{ color: l === league ? '#fff' : colors.text, fontSize: 12 }}>{l.split(' ')[0]}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      <FlatList data={visible} renderItem={renderItem} keyExtractor={(i) => i.idEvent || i.id} onEndReached={loadMore} onEndReachedThreshold={0.5} contentContainerStyle={{ padding: 12 }} />
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
