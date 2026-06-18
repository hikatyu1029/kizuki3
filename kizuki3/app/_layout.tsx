import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Redirect, Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import 'react-native-reanimated';

import { AuthProvider, useAuthContext } from '@/context/auth-context';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { isFirebaseConfigured } from '@/lib/firebase';

export const unstable_settings = {
  anchor: '(tabs)',
};

function NavigationGuard() {
  const { user, loading } = useAuthContext();

  // Firebase 未設定の場合はそのままアプリを表示（開発用）
  if (!isFirebaseConfigured) return null;

  // 認証状態確認中は何も描画しない（スプラッシュスクリーンが残る）
  if (loading) return null;

  // 未ログイン → サインイン画面へ
  if (!user) return <Redirect href="/sign-in" />;

  // ログイン済みだが家族未参加 → 家族設定画面へ（Issue #4 で実装）
  // if (!user.familyId) return <Redirect href="/family-setup" />;

  return null;
}

export default function RootLayout() {
  const colorScheme = useColorScheme();

  return (
    <AuthProvider>
      <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
        <NavigationGuard />
        <Stack>
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          <Stack.Screen name="sign-in" options={{ headerShown: false }} />
          <Stack.Screen name="modal" options={{ presentation: 'modal', title: 'Modal' }} />
        </Stack>
        <StatusBar style="auto" />
      </ThemeProvider>
    </AuthProvider>
  );
}
