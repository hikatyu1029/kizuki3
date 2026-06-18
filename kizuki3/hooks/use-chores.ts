import { useEffect, useState } from 'react';
import {
  addDoc,
  collection,
  doc,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
  type DocumentSnapshot,
  updateDoc,
} from 'firebase/firestore';
import { db, isFirebaseConfigured } from '@/lib/firebase';
import { type Chore } from '@/components/ui/chore-card';

function docToChore(d: DocumentSnapshot): Chore {
  const data = d.data()!;
  return {
    id: d.id,
    title: data.title,
    description: data.description ?? undefined,
    frequency: data.frequency,
    lastDoneDate: data.lastDoneDate,
    lastDoneBy: data.lastDoneByName,
  };
}

type UseChoresResult = {
  chores: Chore[];
  loading: boolean;
  addChore: (data: Omit<Chore, 'id'>) => Promise<void>;
  markDone: (choreId: string, doneByName: string) => Promise<void>;
};

export function useChores(familyId: string | null): UseChoresResult {
  const [chores, setChores] = useState<Chore[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isFirebaseConfigured || !db || !familyId) {
      setLoading(false);
      return;
    }

    const q = query(
      collection(db, 'families', familyId, 'chores'),
      orderBy('updatedAt', 'desc'),
    );

    const unsub = onSnapshot(q, (snap) => {
      setChores(snap.docs.map(docToChore));
      setLoading(false);
    });

    return unsub;
  }, [familyId]);

  async function addChore(data: Omit<Chore, 'id'>) {
    if (!db || !familyId) return;
    await addDoc(collection(db, 'families', familyId, 'chores'), {
      title: data.title,
      description: data.description ?? null,
      frequency: data.frequency,
      lastDoneDate: data.lastDoneDate,
      lastDoneByName: data.lastDoneBy,
      lastDoneByUserId: null,
      updatedAt: serverTimestamp(),
    });
  }

  async function markDone(choreId: string, doneByName: string) {
    if (!db || !familyId) return;
    const today = new Date().toISOString().slice(0, 10);
    await updateDoc(doc(db, 'families', familyId, 'chores', choreId), {
      lastDoneDate: today,
      lastDoneByName: doneByName,
      updatedAt: serverTimestamp(),
    });
  }

  return { chores, loading, addChore, markDone };
}
