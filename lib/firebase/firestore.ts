import {
  collection,
  doc,
  getDoc,
  getDocs,
  setDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  limit,
  type DocumentData,
  type QueryConstraint,
  serverTimestamp,
  increment,
} from "firebase/firestore";
import { db } from "./client";

export async function getDocument<T>(
  collectionName: string,
  docId: string
): Promise<T | null> {
  const snap = await getDoc(doc(db, collectionName, docId));
  if (!snap.exists()) return null;
  return { id: snap.id, ...snap.data() } as T;
}

export async function getDocuments<T>(
  collectionName: string,
  constraints: QueryConstraint[] = []
): Promise<T[]> {
  const q = query(collection(db, collectionName), ...constraints);
  const snap = await getDocs(q);
  return snap.docs.map((d) => ({ id: d.id, ...d.data() }) as T);
}

export async function createDocument(
  collectionName: string,
  docId: string,
  data: DocumentData
) {
  await setDoc(doc(db, collectionName, docId), {
    ...data,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });
}

export async function updateDocument(
  collectionName: string,
  docId: string,
  data: DocumentData
) {
  await updateDoc(doc(db, collectionName, docId), {
    ...data,
    updatedAt: serverTimestamp(),
  });
}

export async function deleteDocument(collectionName: string, docId: string) {
  await deleteDoc(doc(db, collectionName, docId));
}

export async function incrementField(
  collectionName: string,
  docId: string,
  field: string,
  value: number = 1
) {
  await updateDoc(doc(db, collectionName, docId), {
    [field]: increment(value),
  });
}

export { where, orderBy, limit, serverTimestamp, collection, doc, db };
