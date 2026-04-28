import React from 'react';
import { StyleSheet, View, FlatList, Pressable } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { ChoreCard, type Chore } from '@/components/ui/chore-card';

// Simple sample data for MVP. Later persist with AsyncStorage / Zustand.
const sampleChores: Chore[] = [
  {
    id: '1',
    title: '食器洗い',
    description: '夕食後の食器を洗う',
    lastDoneDate: offsetDate(-1),
    lastDoneBy: 'お母さん',
    frequency: 'daily',
  },
  {
    id: '2',
    title: 'ゴミ出し',
    description: '燃えるゴミを出す',
    lastDoneDate: offsetDate(-4),
    lastDoneBy: 'お父さん',
    frequency: 'weekly',
  },
  {
    id: '3',
    title: '洗濯',
    description: '平日一回',
    lastDoneDate: offsetDate(-10),
    lastDoneBy: '妹',
    frequency: 'every3days',
  },
  {
    id: '4',
    title: '掃除機がけ',
    lastDoneDate: offsetDate(-16),
    lastDoneBy: '兄',
    frequency: 'biweekly',
  },
];

function offsetDate(daysAgo: number) {
  const d = new Date();
  d.setDate(d.getDate() + daysAgo);
  return d.toISOString().slice(0, 10);
}

export default function HomeScreen() {
  return (
    <ThemedView style={styles.container}>
      <View style={styles.headerRow}>
        <ThemedText type="title">家事感謝アプリ</ThemedText>
        <Pressable style={styles.plusButton} onPress={() => alert('新規家事追加（未実装）')}>
          <ThemedText type="subtitle">＋</ThemedText>
        </Pressable>
      </View>

      <FlatList
        data={sampleChores}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        renderItem={({ item }) => <ChoreCard chore={item} />}
      />
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    gap: 12,
    marginBottom: 12,
  },
  plusButton: {
    marginLeft: 'auto',
    backgroundColor: 'transparent',
    borderRadius: 6,
    paddingHorizontal: 10,
    paddingVertical: 6,
  },
  list: {
    paddingBottom: 24,
  },
});
