import React from 'react';
import { View, StyleSheet } from 'react-native';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';

export type Frequency = 'daily' | 'every3days' | 'weekly' | 'biweekly' | 'monthly';

export type Chore = {
  id: string;
  title: string;
  description?: string;
  lastDoneDate: string; // YYYY-MM-DD
  lastDoneBy: string;
  frequency: Frequency;
};

const freqToDays: Record<Frequency, number> = {
  daily: 1,
  every3days: 3,
  weekly: 7,
  biweekly: 14,
  monthly: 30,
};

export function getChoreColor(chore: Chore, today = new Date()): string {
  const last = new Date(chore.lastDoneDate + 'T00:00:00');
  const diffMs = today.getTime() - last.getTime();
  const days = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  const period = freqToDays[chore.frequency];

  if (days <= Math.floor(period * 0.8)) return '#22c55e'; // green
  if (days <= period) return '#f59e0b'; // yellow
  if (days <= period + 2) return '#ef4444'; // red
  return '#b91c1c'; // dark red
}

export function ChoreCard({ chore }: { chore: Chore }) {
  const color = getChoreColor(chore);
  const last = new Date(chore.lastDoneDate + 'T00:00:00');
  const today = new Date();
  const diffMs = today.getTime() - last.getTime();
  const days = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  const formattedDate = last.toLocaleDateString('ja-JP', { month: 'numeric', day: 'numeric' });

  return (
    <ThemedView style={styles.card}>
      <View style={[styles.leftBar, { backgroundColor: color }]} />
      <View style={styles.content}>
        <ThemedText type="subtitle" style={styles.title}>{chore.title}</ThemedText>
        {chore.description ? <ThemedText style={styles.desc}>{chore.description}</ThemedText> : null}
        <View style={styles.row}>
          <ThemedText style={styles.meta}>前回：{chore.lastDoneBy}</ThemedText>
          <ThemedText style={styles.meta}>最終：{formattedDate}</ThemedText>
          <View style={styles.badge}>
            <ThemedText style={styles.badgeText}>{days}日ぶり</ThemedText>
          </View>
        </View>
      </View>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'stretch',
    borderRadius: 8,
    overflow: 'hidden',
    marginVertical: 8,
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.08)',
  },
  leftBar: {
    width: 8,
  },
  content: {
    padding: 12,
    flex: 1,
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
  },
  desc: {
    marginTop: 4,
    color: '#6b7280',
  },
  row: {
    marginTop: 8,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  meta: {
    fontSize: 12,
    color: '#374151',
  },
  badge: {
    marginLeft: 'auto',
    backgroundColor: '#111827',
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  badgeText: {
    color: '#fff',
    fontSize: 12,
  },
});
