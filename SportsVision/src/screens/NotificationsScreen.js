import React from 'react';
import { View, Text, StyleSheet, FlatList } from 'react-native';
import { useTheme } from '../theme/ThemeContext';

const dummy = [
  { id: 'n1', title: 'Match reminder', body: 'Red Warriors vs Blue Strikers starts in 2 days' },
  { id: 'n2', title: 'New favourite', body: 'You added Green United to favourites' },
];

export default function NotificationsScreen(){
  const { colors } = useTheme();
  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}> 
      <Text style={[styles.title, { color: colors.text }]}>Notifications</Text>
      <FlatList data={dummy} keyExtractor={i => i.id} renderItem={({ item }) => (
        <View style={[styles.item, { backgroundColor: colors.card, borderColor: colors.border }]}> 
          <Text style={[styles.itemTitle, { color: colors.text }]}>{item.title}</Text>
          <Text style={[styles.itemBody, { color: colors.muted }]}>{item.body}</Text>
        </View>
      )} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  title: { fontSize: 22, fontWeight: '800', marginBottom: 12 },
  item: { padding: 12, borderRadius: 10, borderWidth: 1, marginBottom: 10 },
  itemTitle: { fontWeight: '700' },
  itemBody: { marginTop: 4 }
});
