import React, { useEffect, useState, useCallback } from 'react';
import { View, Text, ActivityIndicator, StyleSheet, FlatList, TouchableOpacity, Modal } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Feather } from '@expo/vector-icons';
import { useTheme } from '../theme/ThemeContext';
import { fetchTeamsByLeague } from '../api/sportsApi';
import DEFAULT_LEAGUES from '../config/leagues';
import ImageWithFallback from '../components/ImageWithFallback';
import { useNavigation, useRoute } from '@react-navigation/native';
import BackHeader from '../components/BackHeader';

export default function TeamsListScreen(){
  const { colors } = useTheme();
  const navigation = useNavigation();
  const route = useRoute();
  const leagueParam = route.params?.league || DEFAULT_LEAGUES[0];

  const [league, setLeague] = useState(leagueParam);
  const [allTeams, setAllTeams] = useState([]);
  const [visible, setVisible] = useState([]);
  const [loading, setLoading] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const PAGE_SIZE = 12;

  useEffect(() => { load(); }, [league]);
  const insets = useSafeAreaInsets();

  const load = async () => {
    setLoading(true);
    try {
      const t = await fetchTeamsByLeague(league);
      setAllTeams(t || []);
      setVisible((t || []).slice(0, PAGE_SIZE));
    } catch (e) {
      setAllTeams([]);
      setVisible([]);
    } finally { setLoading(false); }
  };

  const loadMore = useCallback(() => {
    if (visible.length >= allTeams.length) return;
    const next = allTeams.slice(visible.length, visible.length + PAGE_SIZE);
    setVisible(v => v.concat(next));
  }, [visible, allTeams]);

  const renderItem = ({ item }) => (
    <TouchableOpacity style={[styles.row, { backgroundColor: colors.card, borderColor: colors.border }]} onPress={() => navigation.navigate('Details', { id: item.idTeam, team: item })}>
      <ImageWithFallback uri={item.strTeamBadge} size={48} alt={item.strTeam} />
      <View style={{ marginLeft: 12, flex: 1 }}>
        <Text style={[styles.title, { color: colors.text }]} numberOfLines={1}>{item.strTeam}</Text>
        <Text style={[styles.sub, { color: colors.muted }]} numberOfLines={1}>{item.strLeague}</Text>
      </View>
    </TouchableOpacity>
  );

  const LEAGUES = DEFAULT_LEAGUES;

  const SkeletonRow = () => (
    <View style={[styles.row, { backgroundColor: colors.card, borderColor: colors.card }]}> 
      <View style={{ width: 48, height: 48, borderRadius: 6, backgroundColor: colors.muted }} />
      <View style={{ marginLeft: 12, flex: 1 }}>
        <View style={{ height: 14, width: '60%', backgroundColor: colors.muted, borderRadius: 6, marginBottom: 6 }} />
        <View style={{ height: 12, width: '40%', backgroundColor: colors.muted, borderRadius: 6 }} />
      </View>
    </View>
  );

  const sampleTeams = [
    { idTeam: 's1', strTeam: 'Sample United', strLeague: league },
    { idTeam: 's2', strTeam: 'Example FC', strLeague: league },
    { idTeam: 's3', strTeam: 'Demo Rovers', strLeague: league },
  ];

  return (
    <View style={[styles.container, { backgroundColor: colors.background, paddingTop: insets.top + 8 }]}> 
      <BackHeader title={`Teams — ${league.split(' ')[0]}`} />

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
        visible.length === 0 ? (
          <View style={{ padding: 12 }}>
            {sampleTeams.map(t => renderItem({ item: t }))}
          </View>
        ) : (
          <FlatList data={visible} renderItem={renderItem} keyExtractor={(i) => i.idTeam} onEndReached={loadMore} onEndReachedThreshold={0.5} contentContainerStyle={{ padding: 12 }} />
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
