import React, { useMemo, useEffect } from 'react';
import { SafeAreaView, View, Text, StyleSheet, SectionList, TouchableOpacity } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme } from '../theme/ThemeContext';
import { useNavigation } from '@react-navigation/native';
import { useSelector, useDispatch } from 'react-redux';
import { loadNotificationsFromStorage, persistNotifications, markAllRead } from '../store/notificationsSlice';
import HeaderBar from '../components/HeaderBar';
import BackHeader from '../components/BackHeader';

function groupNotifications(items) {
  const today = [];
  const yesterday = [];
  const older = [];
  const now = Date.now();
  for (const it of items) {
    const diff = now - it.createdAt;
    if (diff < 1000 * 60 * 60 * 24) {
      today.push(it);
    } else if (diff < 1000 * 60 * 60 * 24 * 2) {
      yesterday.push(it);
    } else {
      older.push(it);
    }
  }
  const sections = [];
  if (today.length) sections.push({ title: 'TODAY', data: today });
  if (yesterday.length) sections.push({ title: 'YESTERDAY', data: yesterday });
  if (older.length) sections.push({ title: 'EARLIER', data: older });
  return sections;
}

export default function NotificationsScreen() {
  const { colors } = useTheme();
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const notifications = useSelector(s => s.notifications?.items ?? []);
  const insets = useSafeAreaInsets();

  useEffect(() => { dispatch(loadNotificationsFromStorage()); }, [dispatch]);
  useEffect(() => { dispatch(persistNotifications(notifications)); }, [notifications, dispatch]);

  const sections = useMemo(() => groupNotifications(notifications), [notifications]);

  function renderItem({ item }) {
    const bg = item.unread ? 'rgba(115, 245, 197, 0.15)' : colors.card;
    return (
      <View style={[styles.row, { backgroundColor: bg }]}> 
        <View style={[styles.iconWrap, { backgroundColor: item.color ?? '#e0e0e0' }]}> 
          <Text style={styles.emoji}>{item.emoji}</Text>
        </View>
        <View style={styles.body}>
          <Text style={[styles.heading, { color: colors.text }]} numberOfLines={2}>{item.title}</Text>
          <Text style={[styles.message, { color: colors.muted }]} numberOfLines={3}>{item.body}</Text>
        </View>
      </View>
    );
  }

  function renderSectionHeader({ section: { title } }) {
    return <Text style={[styles.sectionTitle, { color: colors.muted }]}>{title}</Text>;
  }

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background, paddingTop: insets.top + 8 }]}> 
      <HeaderBar title="SportsVision" showBack={false} showBell={true} showProfile={true} />

      <View style={[styles.subHeaderWrap, { backgroundColor: colors.card, borderTopLeftRadius: 16, borderTopRightRadius: 16, marginTop: 12, paddingHorizontal: 12 }]}> 
        <BackHeader title="NOTIFICATION" />
        <View style={styles.subHeaderActions}>
          <TouchableOpacity onPress={() => dispatch(markAllRead())} style={[styles.markBtn, { backgroundColor: colors.background, borderColor: colors.border }] }>
            <Text style={[styles.markBtnText, { color: colors.primary }]}>Mark as read</Text>
          </TouchableOpacity>
        </View>
      </View>

      <SectionList
        sections={sections}
        keyExtractor={item => item.id}
        renderItem={renderItem}
        renderSectionHeader={renderSectionHeader}
        contentContainerStyle={styles.list}
        ItemSeparatorComponent={() => <View style={{ height: 8 }} />}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  headerRow: { height: 56, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', paddingHorizontal: 12 },
  backBtn: { position: 'absolute', left: 12, top: 12, bottom: 12, justifyContent: 'center' },
  backChevron: { fontSize: 28, lineHeight: 28 },
  headerTitle: { fontSize: 16, fontWeight: '800', letterSpacing: 0.8 },
  rightAction: { position: 'absolute', right: 12, top: 12, bottom: 12, justifyContent: 'center' },
  rightActionText: { fontSize: 13, fontWeight: '700' },

  list: { padding: 16, paddingTop: 4 },
  sectionTitle: { fontSize: 12, fontWeight: '700', marginTop: 12, marginBottom: 8, opacity: 0.9 },

  row: { flexDirection: 'row', padding: 12, borderRadius: 12, alignItems: 'flex-start' },
  iconWrap: { width: 44, height: 44, borderRadius: 10, alignItems: 'center', justifyContent: 'center', marginRight: 12 },
  emoji: { fontSize: 20 },
  body: { flex: 1 },
  heading: { fontSize: 14, fontWeight: '700' },
  message: { fontSize: 13, marginTop: 6 },
  subHeaderWrap: { paddingVertical: 8 },
  subHeaderActions: { flexDirection: 'row', justifyContent: 'flex-end', paddingTop: 8 },
  markBtn: { paddingHorizontal: 10, paddingVertical: 6, borderRadius: 12, borderWidth: 1 },
  markBtnText: { fontWeight: '700', fontSize: 13 },
});
