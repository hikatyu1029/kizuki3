import React, { useState } from 'react';
import {
  Modal,
  View,
  TextInput,
  Pressable,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { ThemedText } from '@/components/themed-text';
import { type Chore, type Frequency } from '@/components/ui/chore-card';

const FREQ_OPTIONS: { label: string; value: Frequency }[] = [
  { label: '毎日', value: 'daily' },
  { label: '3日', value: 'every3days' },
  { label: '週1', value: 'weekly' },
  { label: '隔週', value: 'biweekly' },
  { label: '月1', value: 'monthly' },
];

type Props = {
  visible: boolean;
  onClose: () => void;
  onAdd: (chore: Omit<Chore, 'id'>) => void;
};

export function AddChoreModal({ visible, onClose, onAdd }: Props) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [frequency, setFrequency] = useState<Frequency>('weekly');
  const [lastDoneBy, setLastDoneBy] = useState('');

  function handleSubmit() {
    if (!title.trim()) return;
    const today = new Date().toISOString().slice(0, 10);
    onAdd({
      title: title.trim(),
      description: description.trim() || undefined,
      frequency,
      lastDoneDate: today,
      lastDoneBy: lastDoneBy.trim() || 'あなた',
    });
    reset();
    onClose();
  }

  function reset() {
    setTitle('');
    setDescription('');
    setFrequency('weekly');
    setLastDoneBy('');
  }

  function handleClose() {
    reset();
    onClose();
  }

  return (
    <Modal visible={visible} animationType="slide" transparent onRequestClose={handleClose}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.overlay}
      >
        <Pressable style={styles.backdrop} onPress={handleClose} />
        <View style={styles.sheet}>
          <View style={styles.handle} />
          <ScrollView keyboardShouldPersistTaps="handled">
            <ThemedText type="subtitle" style={styles.heading}>
              家事を追加
            </ThemedText>

            <ThemedText style={styles.label}>タイトル *</ThemedText>
            <TextInput
              style={styles.input}
              placeholder="例：食器洗い"
              placeholderTextColor="#9ca3af"
              value={title}
              onChangeText={setTitle}
            />

            <ThemedText style={styles.label}>説明（任意）</ThemedText>
            <TextInput
              style={styles.input}
              placeholder="例：夕食後の食器を洗う"
              placeholderTextColor="#9ca3af"
              value={description}
              onChangeText={setDescription}
            />

            <ThemedText style={styles.label}>頻度</ThemedText>
            <View style={styles.freqRow}>
              {FREQ_OPTIONS.map((opt) => (
                <Pressable
                  key={opt.value}
                  style={[styles.freqBtn, frequency === opt.value && styles.freqBtnActive]}
                  onPress={() => setFrequency(opt.value)}
                >
                  <ThemedText
                    style={[styles.freqText, frequency === opt.value && styles.freqTextActive]}
                  >
                    {opt.label}
                  </ThemedText>
                </Pressable>
              ))}
            </View>

            <ThemedText style={styles.label}>前回やった人（任意）</ThemedText>
            <TextInput
              style={styles.input}
              placeholder="例：お母さん"
              placeholderTextColor="#9ca3af"
              value={lastDoneBy}
              onChangeText={setLastDoneBy}
            />

            <Pressable
              style={[styles.submitBtn, !title.trim() && styles.submitBtnDisabled]}
              onPress={handleSubmit}
              disabled={!title.trim()}
            >
              <ThemedText style={styles.submitText}>追加する</ThemedText>
            </Pressable>
          </ScrollView>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.4)',
  },
  sheet: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    paddingBottom: 40,
    maxHeight: '85%',
  },
  handle: {
    width: 40,
    height: 4,
    backgroundColor: '#d1d5db',
    borderRadius: 2,
    alignSelf: 'center',
    marginBottom: 16,
  },
  heading: {
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 20,
    color: '#111827',
  },
  label: {
    fontSize: 13,
    color: '#6b7280',
    marginBottom: 6,
    marginTop: 12,
  },
  input: {
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 16,
    color: '#111827',
    backgroundColor: '#f9fafb',
  },
  freqRow: {
    flexDirection: 'row',
    gap: 8,
    flexWrap: 'wrap',
  },
  freqBtn: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    backgroundColor: '#f9fafb',
  },
  freqBtnActive: {
    backgroundColor: '#111827',
    borderColor: '#111827',
  },
  freqText: {
    fontSize: 14,
    color: '#374151',
  },
  freqTextActive: {
    color: '#fff',
  },
  submitBtn: {
    marginTop: 28,
    backgroundColor: '#111827',
    borderRadius: 10,
    paddingVertical: 14,
    alignItems: 'center',
  },
  submitBtnDisabled: {
    backgroundColor: '#9ca3af',
  },
  submitText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
  },
});
