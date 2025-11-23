import React, { useEffect, useState } from 'react';
import { View, Text, Image, ScrollView, StyleSheet, ActivityIndicator, TouchableOpacity } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { Feather } from '@expo/vector-icons';
import { fetchTeamDetails } from '../api/sportsApi';
import { useDispatch, useSelector } from 'react-redux';
import { toggleFavourite, persistFavourites } from '../store/favouritesSlice';
import { useTheme } from '../theme/ThemeContext';
import { useNavigation } from '@react-navigation/native';

export default function DetailsScreen({ route }) {
  const { id, team: teamFromList } = route.params || {};
  const [team, setTeam] = useState(teamFromList || null);
  const [loading, setLoading] = useState(false);
  const favourites = useSelector((s) => s.favourites.items);
  const dispatch = useDispatch();
  const { colors } = useTheme();
  const insets = useSafeAreaInsets();
  const navigation = useNavigation();

  useEffect(() => {
    let mounted = true;
    if (!team && id) {
      setLoading(true);
      fetchTeamDetails(id).then((t) => {
        if (mounted) setTeam(t);
        setLoading(false);
      }).catch(() => setLoading(false));
    }
    return () => { mounted = false; };
  }, [id]);

  useEffect(() => { dispatch(persistFavourites(favourites)); }, [favourites, dispatch]);

  if (loading) return <SafeAreaView style={[styles.center, { backgroundColor: colors.background, paddingTop: insets.top + 8 }]}><ActivityIndicator size="large" color={colors.primary} /></SafeAreaView>;
  if (!team) return <SafeAreaView style={[styles.center, { backgroundColor: colors.background, paddingTop: insets.top + 8 }]}><Text style={{ color: colors.text }}>Team not found</Text></SafeAreaView>;

  const isFav = !!favourites.find((f) => f.idTeam === team.idTeam);

  return (
    <SafeAreaView style={[styles.wrapper, { backgroundColor: colors.background, paddingTop: insets.top + 8 }]}> 
      <View style={[styles.header, { borderBottomColor: colors.border }]}> 
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Feather name="arrow-left" size={24} color={colors.primary} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: colors.text }]} numberOfLines={1}>{team.strTeam}</Text>
      </View>
      <ScrollView contentContainerStyle={styles.container}>
        {team.strTeamBadge ? <Image source={{ uri: team.strTeamBadge }} style={styles.badge} /> : null}
        <Text style={[styles.title, { color: colors.text }]}>{team.strTeam}</Text>
        <Text style={[styles.subtitle, { color: colors.muted }]}>{team.strLeague}</Text>
        <TouchableOpacity style={[styles.button, { backgroundColor: isFav ? colors.accent : colors.primary }]} onPress={() => dispatch(toggleFavourite(team))}>
          <Feather name={isFav ? 'heart' : 'heart'} size={20} color="#fff" style={{ marginRight: 8 }} />
          <Text style={styles.buttonText}>{isFav ? 'Unfavourite' : 'Add to Favourites'}</Text>
        </TouchableOpacity>
        <Text style={[styles.desc, { color: colors.text }]}>{team.strDescriptionEN || 'No description available'}</Text>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  wrapper: { flex: 1 },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  header: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, paddingVertical: 12, borderBottomWidth: 1 },
  headerTitle: { fontSize: 18, fontWeight: '700', marginLeft: 12, flex: 1 },
  container: { padding: 16 },
  badge: { width: 140, height: 140, alignSelf: 'center', resizeMode: 'contain', marginBottom: 20 },
  title: { fontSize: 24, fontWeight: '800', textAlign: 'center', marginBottom: 4 },
  subtitle: { textAlign: 'center', marginBottom: 18, fontSize: 14 },
  button: { flexDirection: 'row', padding: 14, borderRadius: 10, alignItems: 'center', justifyContent: 'center', marginBottom: 18 },
  buttonText: { color: '#fff', fontWeight: '700', fontSize: 16 },
  desc: { marginTop: 8, fontSize: 14, lineHeight: 20 },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
});
