import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, FlatList, StyleSheet, KeyboardAvoidingView, Platform } from 'react-native';
import Card from '../components/Card';
import Button from '../components/Button';
import { colors, spacing, typography, radii } from '../theme/theme';
import { api } from '../api/client';

const PROMPTS = [
  "What's one thing that went okay today?",
  "What's weighing on you right now?",
  "Who or what are you grateful for today?",
];

export default function JournalScreen() {
  const [entries, setEntries] = useState([]);
  const [text, setText] = useState('');
  const [prompt] = useState(PROMPTS[Math.floor(Math.random() * PROMPTS.length)]);

  const load = async () => {
    try {
      const data = await api.getJournalEntries();
      setEntries(data);
    } catch (e) {
      setEntries([]);
    }
  };

  useEffect(() => { load(); }, []);

  const submit = async () => {
    if (!text.trim()) return;
    const optimistic = { id: `local-${Date.now()}`, body: text, createdAt: new Date().toISOString() };
    setEntries((prev) => [optimistic, ...prev]);
    setText('');
    try {
      await api.createJournalEntry({ body: optimistic.body });
    } catch (e) {
      // entry stays locally even if the sync fails; a real app should queue + retry
    }
  };

  return (
    <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <Text style={typography.h1}>Journal</Text>
      <Text style={[typography.caption, { marginBottom: spacing.sm }]}>Prompt: {prompt}</Text>
      <Card>
        <TextInput
          style={styles.input}
          multiline
          placeholder="Write what's on your mind..."
          placeholderTextColor={colors.textMuted}
          value={text}
          onChangeText={setText}
        />
        <Button title="Save entry" onPress={submit} style={{ marginTop: spacing.sm }} />
      </Card>

      <FlatList
        style={{ marginTop: spacing.md }}
        data={entries}
        keyExtractor={(item) => String(item.id)}
        renderItem={({ item }) => (
          <Card style={{ marginBottom: spacing.sm }}>
            <Text style={typography.caption}>{new Date(item.createdAt).toLocaleString()}</Text>
            <Text style={typography.body}>{item.body}</Text>
          </Card>
        )}
        ListEmptyComponent={<Text style={typography.caption}>No entries yet — your first one is above.</Text>}
      />
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background, padding: spacing.md },
  input: {
    minHeight: 100,
    textAlignVertical: 'top',
    fontSize: 16,
    color: colors.text,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radii.md,
    padding: spacing.sm,
  },
});
