import { renderHook, act } from '@testing-library/react-native';
import { useChores } from '../use-chores';

// Firebase 未設定で動作確認
jest.mock('@/lib/firebase', () => ({ isFirebaseConfigured: false, db: null, auth: null }));

describe('useChores', () => {
  it('Firebase 未設定・familyId なしのとき空配列を返す', () => {
    const { result } = renderHook(() => useChores(null));
    expect(result.current.chores).toEqual([]);
    expect(result.current.loading).toBe(false);
  });

  it('Firebase 未設定のとき addChore は何もしない', async () => {
    const { result } = renderHook(() => useChores('family-1'));
    await act(async () => {
      await result.current.addChore({
        title: 'テスト',
        frequency: 'weekly',
        lastDoneDate: '2024-01-01',
        lastDoneBy: 'テスト',
      });
    });
    // エラーが発生しないことを確認
    expect(result.current.chores).toEqual([]);
  });

  it('Firebase 未設定のとき markDone は何もしない', async () => {
    const { result } = renderHook(() => useChores('family-1'));
    await act(async () => {
      await result.current.markDone('chore-1', 'テスト');
    });
    expect(result.current.chores).toEqual([]);
  });
});
