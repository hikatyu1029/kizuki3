import React, { useState } from 'react';
import { StyleSheet, View, Pressable, ActivityIndicator, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';

// TODO: Google / Apple Sign In の実装は Issue #3 を参照
// expo-apple-authentication + expo-auth-session を使う
export default function SignInScreen() {
  const [loading, setLoading] = useState(false);

  async function handleGoogleSignIn() {
    setLoading(true);
    try {
      // TODO: implement
      Alert.alert('Google Sign In', '実装予定（Issue #3）');
    } finally {
      setLoading(false);
    }
  }

  async function handleAppleSignIn() {
    setLoading(true);
    try {
      // TODO: implement
      Alert.alert('Apple Sign In', '実装予定（Issue #3）');
    } finally {
      setLoading(false);
    }
  }

  return (
    <SafeAreaView style={styles.safe}>
      <ThemedView style={styles.container}>
        <View style={styles.hero}>
          <ThemedText type="title" style={styles.appName}>家事感謝</ThemedText>
          <ThemedText style={styles.tagline}>家族の家事を記録して、感謝を可視化する</ThemedText>
        </View>

        {loading ? (
          <ActivityIndicator size="large" color="#111827" />
        ) : (
          <View style={styles.buttons}>
            <Pressable style={[styles.btn, styles.googleBtn]} onPress={handleGoogleSignIn}>
              <ThemedText style={styles.googleText}>Google でサインイン</ThemedText>
            </Pressable>
            <Pressable style={[styles.btn, styles.appleBtn]} onPress={handleAppleSignIn}>
              <ThemedText style={styles.appleText}>Apple でサインイン</ThemedText>
            </Pressable>
          </View>
        )}
      </ThemedView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1 },
  container: { flex: 1, paddingHorizontal: 32, justifyContent: 'center', gap: 48 },
  hero: { alignItems: 'center', gap: 12 },
  appName: { fontSize: 40, fontWeight: '800' },
  tagline: { textAlign: 'center', color: '#6b7280', fontSize: 16 },
  buttons: { gap: 12 },
  btn: {
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
  },
  googleBtn: { backgroundColor: '#fff', borderWidth: 1, borderColor: '#e5e7eb' },
  googleText: { color: '#111827', fontWeight: '600', fontSize: 16 },
  appleBtn: { backgroundColor: '#111827' },
  appleText: { color: '#fff', fontWeight: '600', fontSize: 16 },
});
