import React from 'react';
import { View, FlatList, Text, StyleSheet } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { Feather } from '@expo/vector-icons';
import { useSelector } from 'react-redux';
import TeamCard from '../components/TeamCard';
import { useNavigation } from '@react-navigation/native';
import { useDispatch } from 'react-redux';
import { toggleFavourite } from '../store/favouritesSlice';
import { useTheme } from '../theme/ThemeContext';
import HeaderBar from '../components/HeaderBar';
import BackHeader from '../components/BackHeader';



export default function FavouritesScreen() {
  const favourites = useSelector((s) => s.favourites.items);
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const { colors } = useTheme();
  const insets = useSafeAreaInsets();

  const onPress = (team) => navigation.navigate('Details', { id: team.idTeam, team });

  if (!favourites || favourites.length === 0) {
    return (
      <SafeAreaView style={[styles.center, { backgroundColor: colors.background, paddingTop: insets.top + 2 }]}>
        <Feather name="heart" size={48} color={colors.muted} />
        <Text style={[styles.emptyText, { color: colors.text }]}>No favourites yet</Text>
        <Text style={[styles.emptySubtext, { color: colors.muted }]}>Add teams to your favourites</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background, paddingTop: insets.top + 4 }]}> 
      <HeaderBar title="SportsVision" showBack={false} showBell={true} showProfile={true} />

      <View style={[styles.subHeaderWrap, { backgroundColor: colors.card, borderTopLeftRadius: 16, borderTopRightRadius: 16, marginTop: 12 }]}> 
        <BackHeader title="FAVOURITES" />
      </View>

      <FlatList data={favourites} keyExtractor={(i) => i.idTeam} renderItem={({ item }) => (
        <TeamCard team={item} onPress={onPress} isFav onToggleFav={() => dispatch(toggleFavourite(item))} />
      )} contentContainerStyle={styles.listContent} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  subHeaderWrap: { paddingVertical: 8 },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  header: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, paddingVertical: 12, borderBottomWidth: 1 },
  headerTitle: { fontSize: 20, fontWeight: '700', marginLeft: 12 },
  listContent: { paddingVertical: 8 },
  emptyText: { fontSize: 18, fontWeight: '700', marginTop: 16 },
  emptySubtext: { fontSize: 14, marginTop: 8 },
});
