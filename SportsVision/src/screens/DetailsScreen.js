import React, { useEffect, useState } from 'react';
import { View, Text, Image, ScrollView, Button, StyleSheet, ActivityIndicator } from 'react-native';
import { fetchTeamDetails } from '../api/sportsApi';
import { useDispatch, useSelector } from 'react-redux';
import { toggleFavourite, persistFavourites } from '../store/favouritesSlice';

export default function DetailsScreen({ route }) {
  const { id, team: teamFromList } = route.params || {};
  const [team, setTeam] = useState(teamFromList || null);
  const [loading, setLoading] = useState(false);
  const favourites = useSelector((s) => s.favourites.items);
  const dispatch = useDispatch();

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

  if (loading) return <View style={styles.center}><ActivityIndicator /></View>;
  if (!team) return <View style={styles.center}><Text>Team not found</Text></View>;

  const isFav = !!favourites.find((f) => f.idTeam === team.idTeam);

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {team.strTeamBadge ? <Image source={{ uri: team.strTeamBadge }} style={styles.badge} /> : null}
      <Text style={styles.title}>{team.strTeam}</Text>
      <Text style={styles.subtitle}>{team.strLeague}</Text>
      <Button title={isFav ? 'Remove Favourite' : 'Add to Favourites'} onPress={() => dispatch(toggleFavourite(team))} />
      <Text style={styles.desc}>{team.strDescriptionEN}</Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { padding: 16 },
  badge: { width: 120, height: 120, alignSelf: 'center', resizeMode: 'contain', marginBottom: 12 },
  title: { fontSize: 20, fontWeight: '700', textAlign: 'center' },
  subtitle: { textAlign: 'center', color: '#666', marginBottom: 12 },
  desc: { marginTop: 12, color: '#333' },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
});
