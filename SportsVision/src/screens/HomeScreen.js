import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, ActivityIndicator, StyleSheet } from 'react-native';
import { fetchTeamsByLeague } from '../api/sportsApi';
import TeamCard from '../components/TeamCard';
import { useNavigation } from '@react-navigation/native';
import { useSelector, useDispatch } from 'react-redux';
import { toggleFavourite, persistFavourites } from '../store/favouritesSlice';

export default function HomeScreen() {
  const [teams, setTeams] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigation = useNavigation();
  const favourites = useSelector((s) => s.favourites.items);
  const dispatch = useDispatch();

  useEffect(() => {
    setLoading(true);
    fetchTeamsByLeague().then((t) => {
      setTeams(t);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, []);

  useEffect(() => {
    dispatch(persistFavourites(favourites));
  }, [favourites, dispatch]);

  const onPress = (team) => navigation.navigate('Details', { id: team.idTeam, team });
  const onToggleFav = (team) => dispatch(toggleFavourite(team));

  if (loading) return <View style={styles.center}><ActivityIndicator /></View>;

  return (
    <View style={styles.container}>
      <FlatList data={teams} keyExtractor={(i) => i.idTeam} renderItem={({ item }) => (
        <TeamCard team={item} onPress={onPress} onToggleFav={onToggleFav} isFav={!!favourites.find(f => f.idTeam === item.idTeam)} />
      )} />
    </View>
  );
}

const styles = StyleSheet.create({ container: { flex: 1 }, center: { flex: 1, justifyContent: 'center', alignItems: 'center' } });
