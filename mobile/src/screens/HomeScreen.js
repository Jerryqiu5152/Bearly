import React, { useEffect, useState, useCallback } from 'react';
import { View, Text, StyleSheet, ScrollView, RefreshControl } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import Card from '../components/Card';
import Button from '../components/Button';
import CompanionAvatar from '../components/CompanionAvatar';
import { colors, spacing, typography } from '../theme/theme';
import { api } from '../api/client';

const TASKS = [
  { key: 'walk', label: 'Take a 10-min walk', points: 10 },
  { key: 'water', label: 'Drink a glass of water', points: 5 },
  { key: 'journal', label: 'Write a journal entry', points: 15 },
  { key: 'breathe', label: '2-minute breathing exercise', points: 10 },
];

export default function HomeScreen({ navigation }) {
  const [companion, setCompanion] = useState(null);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    try {
      const data = await api.getCompanion();
      setCompanion(data);
    } catch (e) {
      // Fallback demo state so the UI is still usable offline/in dev
      setCompanion({ species: 'bear', stage: 1, mood: 'happy', name: 'Barnaby', streak: 3, points: 40 });
    } finally {
      setLoading(false);
    }
  }, []);

  useFocusEffect(useCallback(() => { load(); }, [load]));

  const completeTask = async (taskKey) => {
    try {
      const updated = await api.completeTask(taskKey);
      setCompanion(updated);
    } catch (e) {
      // Optimistic local fallback
      setCompanion((c) => c && { ...c, points: c.points + 10 });
    }
  };

  return (
    <ScrollView
      style={styles.container}
      refreshControl={<RefreshControl refreshing={loading} onRefresh={load} />}
      contentContainerStyle={{ padding: spacing.md }}
    >
      <Text style={typography.h1}>Hi there 🐻</Text>
      <Text style={[typography.body, { color: colors.textMuted, marginBottom: spacing.md }]}>
        Here's how {companion?.name || 'your companion'} is doing today.
      </Text>

      <Card style={{ alignItems: 'center', paddingVertical: spacing.lg }}>
        <CompanionAvatar species={companion?.species} stage={companion?.stage} mood={companion?.mood} />
        <Text style={[typography.h3, { marginTop: spacing.sm }]}>{companion?.name || 'Companion'}</Text>
        <Text style={typography.caption}>{companion?.streak || 0}-day care streak · {companion?.points || 0} pts</Text>
      </Card>

      <Text style={[typography.h3, { marginTop: spacing.lg, marginBottom: spacing.sm }]}>
        Today's wellness tasks
      </Text>
      {TASKS.map((t) => (
        <Card key={t.key} style={styles.taskRow}>
          <View style={{ flex: 1 }}>
            <Text style={typography.body}>{t.label}</Text>
            <Text style={typography.caption}>+{t.points} pts</Text>
          </View>
          <Button title="Done" variant="accent" onPress={() => completeTask(t.key)} />
        </Card>
      ))}

      <Button
        title="I need support now"
        variant="danger"
        style={{ marginTop: spacing.xl }}
        onPress={() => navigation.navigate('Crisis')}
      />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  taskRow: { flexDirection: 'row', alignItems: 'center', marginBottom: spacing.sm },
});
