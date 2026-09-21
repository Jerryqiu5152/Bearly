import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Linking, ScrollView, Platform } from 'react-native';
import Card from '../components/Card';
import Button from '../components/Button';
import { colors, spacing, typography } from '../theme/theme';
import { api } from '../api/client';

// Static fallback so this screen NEVER renders empty, even with no network —
// crisis info must always be available offline.
const FALLBACK_US = {
  country: 'US',
  lifeline: { name: '988 Suicide & Crisis Lifeline', phone: '988', sms: null, note: 'Call or text 988, 24/7.' },
  textLine: { name: 'Crisis Text Line', phone: null, sms: '741741', smsBody: 'HOME', note: 'Text HOME to 741741, 24/7.' },
  emergency: { name: 'Emergency Services', phone: '911' },
};

export default function CrisisScreen() {
  const [resources, setResources] = useState(FALLBACK_US);

  useEffect(() => {
    api.getCrisisResources()
      .then((r) => r && setResources(r))
      .catch(() => {}); // keep fallback
  }, []);

  const call = (number) => Linking.openURL(`tel:${number}`);
  const text = (number, body) => Linking.openURL(`sms:${number}${Platform.OS === 'ios' ? '&' : '?'}body=${encodeURIComponent(body || '')}`);

  return (
    <ScrollView style={styles.container} contentContainerStyle={{ padding: spacing.md }}>
      <Text style={typography.h1}>You're not alone</Text>
      <Text style={[typography.body, { marginBottom: spacing.md }]}>
        If you're in immediate danger, call emergency services now.
      </Text>

      <Button title={`Call ${resources.emergency.phone} (Emergency)`} variant="danger"
        onPress={() => call(resources.emergency.phone)} />

      <Card style={{ marginTop: spacing.lg }}>
        <Text style={typography.h3}>{resources.lifeline.name}</Text>
        <Text style={[typography.caption, { marginBottom: spacing.sm }]}>{resources.lifeline.note}</Text>
        <Button title={`Call ${resources.lifeline.phone}`} onPress={() => call(resources.lifeline.phone)} />
      </Card>

      {resources.textLine?.sms && (
        <Card style={{ marginTop: spacing.md }}>
          <Text style={typography.h3}>{resources.textLine.name}</Text>
          <Text style={[typography.caption, { marginBottom: spacing.sm }]}>{resources.textLine.note}</Text>
          <Button title="Text now" variant="accent"
            onPress={() => text(resources.textLine.sms, resources.textLine.smsBody)} />
        </Card>
      )}

      <Card style={{ marginTop: spacing.md }}>
        <Text style={typography.h3}>Notify an emergency contact</Text>
        <Text style={[typography.caption, { marginBottom: spacing.sm }]}>
          Sends your chosen contact a message so they know to check on you. Set contacts in Profile → Emergency Contacts.
        </Text>
        <Button title="Alert my emergency contact" variant="outline" onPress={() => { /* wire to backend /checkins/alert */ }} />
      </Card>

      <Text style={[typography.caption, { marginTop: spacing.lg, color: colors.textMuted }]}>
        Bearly is not a substitute for professional care. In the US, resources shown are 988 (Suicide & Crisis
        Lifeline) and Crisis Text Line. Outside the US, resources are localized by your device region — verify
        local emergency numbers are current for your area.
      </Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
});
