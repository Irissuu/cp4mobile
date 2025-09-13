import {
  collection, addDoc, serverTimestamp,
  query, where, orderBy, onSnapshot,
  updateDoc, deleteDoc, doc,
  Timestamp
} from 'firebase/firestore';
import { db } from './firebaseConfig';

export type Task = {
  id: string;
  userId: string;
  title: string;
  note: string;
  category: 'trabalhos' | 'projetos' | 'pessoal' | 'estudos' | 'consultas' | 'tarefas';
  dueAt: Timestamp | null;
  done: boolean;
  createdAt: Timestamp;
};

const col = collection(db, 'tasks');

export function listenUserTasks(userId: string, cb: (list: Task[]) => void) {
  const q = query(col, where('userId', '==', userId), orderBy('createdAt', 'desc'));
  return onSnapshot(q, snap => {
    const list: Task[] = snap.docs.map(d => ({ id: d.id, ...(d.data() as Omit<Task,'id'>) }));
    cb(list);
  });
}

export async function addTask(userId: string, data: {
  title: string; note?: string; category: Task['category']; dueAt?: Date | null;
}) {
  return addDoc(col, {
    userId,
    title: data.title,
    note: data.note ?? '',
    category: data.category,
    dueAt: data.dueAt ? Timestamp.fromDate(data.dueAt) : null,
    done: false,
    createdAt: serverTimestamp(),
  });
}

export function toggleTaskDone(task: Task, value: boolean) {
  return updateDoc(doc(db, 'tasks', task.id), { done: value });
}

export function updateTask(taskId: string, patch: Partial<Omit<Task, 'id' | 'userId' | 'createdAt'>>) {
  return updateDoc(doc(db, 'tasks', taskId), patch as any);
}

export function removeTask(taskId: string) {
  return deleteDoc(doc(db, 'tasks', taskId));
}
