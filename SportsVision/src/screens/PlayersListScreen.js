import React, { useEffect, useState, useCallback } from 'react';
import { View, Text, ActivityIndicator, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useTheme } from '../theme/ThemeContext';
import { fetchTeamsByLeague, fetchPlayersByTeam } from '../api/sportsApi';
import ImageWithFallback from '../components/ImageWithFallback';
import { useNavigation, useRoute } from '@react-navigation/native';

export default function PlayersListScreen(){
  const { colors } = useTheme();
  const navigation = useNavigation();
  const route = useRoute();
  const league = route.params?.league || 'English Premier League';

  const [allPlayers, setAllPlayers] = useState([]);
  const [visible, setVisible] = useState([]);
  const [loading, setLoading] = useState(false);
  const PAGE_SIZE = 16;

  useEffect(() => { load(); }, [league]);

  const load = async () => {
    setLoading(true);
    try {
      const teams = await fetchTeamsByLeague(league);
      const topTeams = (teams || []).slice(0, 8);
      let playersAcc = [];
      await Promise.all(topTeams.map(async (tm) => {
        const p = await fetchPlayersByTeam(tm.idTeam).catch(()=>[]);
        if (p && p.length) playersAcc = playersAcc.concat(p);
      }));

      // dedupe by idPlayer
      const map = new Map();
      (playersAcc || []).forEach(pl => {
        if (!pl) return;
        const k = pl.idPlayer || pl.id;
        if (k && !map.has(k)) map.set(k, pl);
      });
      const deduped = Array.from(map.values());
      setAllPlayers(deduped);
      setVisible(deduped.slice(0, PAGE_SIZE));
    } catch (e) {
      setAllPlayers([]);
      setVisible([]);
    } finally { setLoading(false); }
  };

  const loadMore = useCallback(() => {
    if (visible.length >= allPlayers.length) return;
    const next = allPlayers.slice(visible.length, visible.length + PAGE_SIZE);
    setVisible(v => v.concat(next));
  }, [visible, allPlayers]);

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

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}> 
      <View style={[styles.header, { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }]}>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={{ padding: 8 }}>
            <Feather name="chevron-left" size={20} color={colors.primary} />
          </TouchableOpacity>
          <Text style={[styles.headerTitle, { color: colors.text }]}>All Players</Text>
        </View>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          {LEAGUES.map(l => (
            <TouchableOpacity key={l} onPress={() => { if (l !== league) navigation.replace('Players', { league: l }); }} style={{ paddingHorizontal: 8, paddingVertical: 6, marginLeft: 6, borderRadius: 8, backgroundColor: l === league ? colors.primary : 'transparent' }}>
              <Text style={{ color: l === league ? '#fff' : colors.text, fontSize: 12 }}>{l.split(' ')[0]}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {loading ? (
        <View style={{ padding: 12 }}>
          <SkeletonRow />
          <View style={{ height: 8 }} />
          <SkeletonRow />
          <View style={{ height: 8 }} />
          <SkeletonRow />
        </View>
      ) : (
        <FlatList data={visible} renderItem={renderItem} keyExtractor={(i) => i.idPlayer || i.id} onEndReached={loadMore} onEndReachedThreshold={0.5} contentContainerStyle={{ padding: 12 }} />
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
