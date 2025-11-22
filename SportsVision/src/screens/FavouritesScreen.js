import React from 'react';
import { View, FlatList, Text, StyleSheet } from 'react-native';
import { useSelector } from 'react-redux';
import TeamCard from '../components/TeamCard';
import { useNavigation } from '@react-navigation/native';
import { useDispatch } from 'react-redux';
import { toggleFavourite } from '../store/favouritesSlice';

export default function FavouritesScreen() {
  const favourites = useSelector((s) => s.favourites.items);
  const navigation = useNavigation();
  const dispatch = useDispatch();

  const onPress = (team) => navigation.navigate('Details', { id: team.idTeam, team });

  if (!favourites || favourites.length === 0) return <View style={styles.center}><Text>No favourites yet.</Text></View>;

  return (
    <View style={styles.container}>
      <FlatList data={favourites} keyExtractor={(i) => i.idTeam} renderItem={({ item }) => (
        <TeamCard team={item} onPress={onPress} isFav onToggleFav={() => dispatch(toggleFavourite(item))} />
      )} />
    </View>
  );
}

const styles = StyleSheet.create({ container: { flex: 1 }, center: { flex: 1, justifyContent: 'center', alignItems: 'center' } });
