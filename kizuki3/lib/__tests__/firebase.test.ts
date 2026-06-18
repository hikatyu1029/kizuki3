// firebase モジュールのモックは moduleNameMapper で設定済み

describe('firebase module', () => {
  it('Firebase 未設定環境では isFirebaseConfigured が false', () => {
    // テスト環境では EXPO_PUBLIC_FIREBASE_PROJECT_ID が未設定
    const { isFirebaseConfigured, db, auth } = require('../firebase');
    expect(isFirebaseConfigured).toBe(false);
    expect(db).toBeNull();
    expect(auth).toBeNull();
  });

  it('isFirebaseConfigured が false なら初期化されない', () => {
    const { initializeApp } = require('firebase/app');
    const { isFirebaseConfigured } = require('../firebase');
    // Firebase 未設定時は initializeApp を呼ばない
    if (!isFirebaseConfigured) {
      expect(initializeApp).not.toHaveBeenCalled();
    }
  });
});
