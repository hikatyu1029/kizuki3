import { useEffect, useState } from 'react';
import { onAuthStateChanged, type User } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { auth, db, isFirebaseConfigured } from '@/lib/firebase';

export type UserProfile = {
  uid: string;
  displayName: string;
  photoURL: string | null;
  familyId: string | null;
  plan: 'free' | 'premium';
};

type AuthState = {
  user: UserProfile | null;
  loading: boolean;
};

export function useAuth(): AuthState {
  const [state, setState] = useState<AuthState>({ user: null, loading: isFirebaseConfigured });

  useEffect(() => {
    if (!isFirebaseConfigured || !auth) {
      setState({ user: null, loading: false });
      return;
    }

    const unsub = onAuthStateChanged(auth, async (firebaseUser: User | null) => {
      if (!firebaseUser || !db) {
        setState({ user: null, loading: false });
        return;
      }
      // Firestore からプロフィール（familyId, plan）を取得
      const snap = await getDoc(doc(db, 'users', firebaseUser.uid));
      const data = snap.data();
      setState({
        user: {
          uid: firebaseUser.uid,
          displayName: firebaseUser.displayName ?? 'ユーザー',
          photoURL: firebaseUser.photoURL,
          familyId: data?.familyId ?? null,
          plan: data?.plan ?? 'free',
        },
        loading: false,
      });
    });

    return unsub;
  }, []);

  return state;
}
