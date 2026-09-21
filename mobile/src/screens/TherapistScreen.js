import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';
import Card from '../components/Card';
import Button from '../components/Button';
import { colors, spacing, typography } from '../theme/theme';
import { api } from '../api/client';

export default function TherapistScreen() {
  const [therapists, setTherapists] = useState([]);

  useEffect(() => {
    api.getTherapists({}).then(setTherapists).catch(() => setTherapists([]));
  }, []);

  const request = async (id) => {
    try { await api.requestSession(id); } catch {}
  };

  return (
    <View style={styles.container}>
      <Text style={typography.h1}>Talk to someone</Text>
      <Text style={[typography.caption, { marginBottom: spacing.sm }]}>
        Licensed therapists and doctors available for virtual sessions. This directory reflects real
        credentialed providers only — verification happens on the backend before anyone is listed.
      </Text>
      <FlatList
        data={therapists}
        keyExtractor={(item) => String(item.id)}
        renderItem={({ item }) => (
          <Card style={{ marginBottom: spacing.sm }}>
            <Text style={typography.h3}>{item.name}</Text>
            <Text style={typography.caption}>{item.credentials} · {item.specialty}</Text>
            <Text style={[typography.body, { marginVertical: spacing.xs }]}>{item.bio}</Text>
            <Button title="Request session" variant="accent" onPress={() => request(item.id)} />
          </Card>
        )}
        ListEmptyComponent={
          <Text style={typography.caption}>
            No providers loaded yet. Connect the backend's therapist directory (see /backend/src/routes/therapists.js).
          </Text>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background, padding: spacing.md },
});
