import React, { useEffect, useState, useCallback } from 'react';
import { View, Text, ActivityIndicator, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
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

  if (loading) return <View style={[styles.center, { backgroundColor: colors.background }]}><ActivityIndicator color={colors.primary} /></View>;

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}> 
      <View style={styles.header}><Text style={[styles.headerTitle, { color: colors.text }]}>All Players — {league}</Text></View>
      <FlatList data={visible} renderItem={renderItem} keyExtractor={(i) => i.idPlayer || i.id} onEndReached={loadMore} onEndReachedThreshold={0.5} contentContainerStyle={{ padding: 12 }} />
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
