import React, { useState } from 'react';
import { StyleSheet, View, FlatList, Pressable, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { ChoreCard, type Chore } from '@/components/ui/chore-card';
import { AddChoreModal } from '@/components/ui/add-chore-modal';
import { useAuthContext } from '@/context/auth-context';
import { useChores } from '@/hooks/use-chores';
import { isFirebaseConfigured } from '@/lib/firebase';

// Firebase 未設定時のフォールバック用サンプルデータ
const initialChores: Chore[] = [
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
  const { user } = useAuthContext();
  const { chores: firestoreChores, loading, addChore, markDone } = useChores(user?.familyId ?? null);

  // Firebase 未設定時はローカル state で動作
  const [localChores, setLocalChores] = useState<Chore[]>(initialChores);
  const [modalVisible, setModalVisible] = useState(false);

  const chores = isFirebaseConfigured ? firestoreChores : localChores;

  async function handleComplete(id: string) {
    if (isFirebaseConfigured) {
      await markDone(id, user?.displayName ?? 'あなた');
    } else {
      const today = new Date().toISOString().slice(0, 10);
      setLocalChores((prev) =>
        prev.map((c) => (c.id === id ? { ...c, lastDoneDate: today, lastDoneBy: 'あなた' } : c)),
      );
    }
  }

  async function handleAdd(data: Omit<Chore, 'id'>) {
    if (isFirebaseConfigured) {
      await addChore(data);
    } else {
      setLocalChores((prev) => [{ id: String(Date.now()), ...data }, ...prev]);
    }
  }

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <ThemedView style={styles.container}>
        <View style={styles.headerRow}>
          <ThemedText type="title">家事感謝アプリ</ThemedText>
          <Pressable style={styles.plusButton} onPress={() => setModalVisible(true)}>
            <ThemedText type="subtitle">＋</ThemedText>
          </Pressable>
        </View>

        {loading ? (
          <ActivityIndicator style={styles.loading} />
        ) : (
          <FlatList
            data={chores}
            keyExtractor={(item) => item.id}
            contentContainerStyle={styles.list}
            renderItem={({ item }) => (
              <ChoreCard chore={item} onPress={() => handleComplete(item.id)} />
            )}
          />
        )}

        <AddChoreModal
          visible={modalVisible}
          onClose={() => setModalVisible(false)}
          onAdd={handleAdd}
        />
      </ThemedView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
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
  list: { paddingBottom: 24 },
  loading: { flex: 1 },
});
