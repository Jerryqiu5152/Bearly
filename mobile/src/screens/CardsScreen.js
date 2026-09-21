import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, FlatList, StyleSheet } from 'react-native';
import Card from '../components/Card';
import Button from '../components/Button';
import { colors, spacing, typography, radii } from '../theme/theme';
import { api } from '../api/client';

export default function CardsScreen() {
  const [recipient, setRecipient] = useState('');
  const [message, setMessage] = useState('');
  const [received, setReceived] = useState([]);

  const load = async () => {
    try {
      setReceived(await api.getReceivedCards());
    } catch {
      setReceived([]);
    }
  };
  useEffect(() => { load(); }, []);

  const send = async () => {
    if (!recipient.trim() || !message.trim()) return;
    try {
      await api.sendCard({ recipientHandle: recipient, message });
      setRecipient('');
      setMessage('');
    } catch (e) {
      // surface a toast/snackbar in a full implementation
    }
  };

  return (
    <View style={styles.container}>
      <Text style={typography.h1}>Motivation Cards</Text>
      <Card style={{ marginTop: spacing.sm }}>
        <Text style={typography.h3}>Send a card</Text>
        <TextInput
          style={styles.input}
          placeholder="Friend's @handle"
          placeholderTextColor={colors.textMuted}
          value={recipient}
          onChangeText={setRecipient}
        />
        <TextInput
          style={[styles.input, { minHeight: 70, textAlignVertical: 'top', marginTop: spacing.sm }]}
          placeholder="Write something encouraging..."
          placeholderTextColor={colors.textMuted}
          multiline
          value={message}
          onChangeText={setMessage}
        />
        <Button title="Send card" variant="accent" style={{ marginTop: spacing.sm }} onPress={send} />
      </Card>

      <Text style={[typography.h3, { marginTop: spacing.lg, marginBottom: spacing.sm }]}>Cards you've received</Text>
      <FlatList
        data={received}
        keyExtractor={(item) => String(item.id)}
        renderItem={({ item }) => (
          <Card style={{ marginBottom: spacing.sm, backgroundColor: colors.accentSoft }}>
            <Text style={typography.caption}>From {item.senderHandle}</Text>
            <Text style={typography.body}>{item.message}</Text>
          </Card>
        )}
        ListEmptyComponent={<Text style={typography.caption}>No cards yet.</Text>}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background, padding: spacing.md },
  input: {
    fontSize: 16,
    color: colors.text,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radii.md,
    padding: spacing.sm,
  },
});
