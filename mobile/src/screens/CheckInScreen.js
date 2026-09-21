import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity } from 'react-native';
import Card from '../components/Card';
import { colors, spacing, typography, radii } from '../theme/theme';
import { api } from '../api/client';

const MOODS = [
  { key: 'great', emoji: '😄', label: 'Great' },
  { key: 'okay', emoji: '🙂', label: 'Okay' },
  { key: 'meh', emoji: '😐', label: 'Meh' },
  { key: 'low', emoji: '😔', label: 'Low' },
  { key: 'struggling', emoji: '😣', label: 'Struggling' },
];

export default function CheckInScreen() {
  const [feed, setFeed] = useState([]);

  const load = async () => {
    try { setFeed(await api.getCheckInFeed()); } catch { setFeed([]); }
  };
  useEffect(() => { load(); }, []);

  const sendMood = async (mood) => {
    try {
      await api.sendCheckIn({ mood });
      load();
    } catch (e) {}
  };

  return (
    <View style={styles.container}>
      <Text style={typography.h1}>Check In</Text>
      <Text style={[typography.caption, { marginBottom: spacing.sm }]}>
        Share how you're doing with the family & friends circle you've chosen to check in with.
      </Text>
      <Card>
        <Text style={typography.h3}>How are you feeling?</Text>
        <View style={styles.moodRow}>
          {MOODS.map((m) => (
            <TouchableOpacity key={m.key} style={styles.moodBtn} onPress={() => sendMood(m.key)}>
              <Text style={{ fontSize: 28 }}>{m.emoji}</Text>
              <Text style={typography.caption}>{m.label}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </Card>

      <Text style={[typography.h3, { marginTop: spacing.lg, marginBottom: spacing.sm }]}>Circle feed</Text>
      <FlatList
        data={feed}
        keyExtractor={(item) => String(item.id)}
        renderItem={({ item }) => (
          <Card style={{ marginBottom: spacing.sm, flexDirection: 'row', alignItems: 'center' }}>
            <Text style={{ fontSize: 22, marginRight: spacing.sm }}>
              {MOODS.find((m) => m.key === item.mood)?.emoji || '💬'}
            </Text>
            <View>
              <Text style={typography.body}>{item.userName} is feeling {item.mood}</Text>
              <Text style={typography.caption}>{new Date(item.createdAt).toLocaleString()}</Text>
            </View>
          </Card>
        )}
        ListEmptyComponent={<Text style={typography.caption}>No check-ins yet from your circle.</Text>}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background, padding: spacing.md },
  moodRow: { flexDirection: 'row', justifyContent: 'space-between', marginTop: spacing.sm },
  moodBtn: { alignItems: 'center', padding: spacing.xs, borderRadius: radii.md },
});
