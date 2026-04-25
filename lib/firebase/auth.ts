import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  signOut as firebaseSignOut,
  sendPasswordResetEmail as firebaseSendPasswordResetEmail,
  updateProfile,
  type User,
} from "firebase/auth";
import { doc, setDoc, getDoc, serverTimestamp } from "firebase/firestore";
import { auth, db } from "./client";
import { nanoid } from "nanoid";

const googleProvider = new GoogleAuthProvider();

export async function signInWithEmail(email: string, password: string) {
  const result = await signInWithEmailAndPassword(auth, email, password);
  await syncSession(result.user);
  return result.user;
}

export async function signUpWithEmail(
  email: string,
  password: string,
  name: string
) {
  const result = await createUserWithEmailAndPassword(auth, email, password);
  await updateProfile(result.user, { displayName: name });
  await createUserDoc(result.user, name);
  await syncSession(result.user);
  return result.user;
}

export async function signInWithGoogle() {
  const result = await signInWithPopup(auth, googleProvider);
  const userDoc = await getDoc(doc(db, "users", result.user.uid));
  if (!userDoc.exists()) {
    await createUserDoc(result.user, result.user.displayName || "");
  }
  await syncSession(result.user);
  return result.user;
}

export async function signOut() {
  await fetch("/api/auth/session", { method: "DELETE" });
  await firebaseSignOut(auth);
}

export async function sendPasswordResetEmail(email: string) {
  await firebaseSendPasswordResetEmail(auth, email);
}

async function createUserDoc(user: User, name: string) {
  await setDoc(doc(db, "users", user.uid), {
    uid: user.uid,
    email: user.email,
    name: name,
    phone: "",
    country: "",
    avatarUrl: "",
    role: "user",
    referralCode: nanoid(8),
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });
}

async function syncSession(user: User) {
  const idToken = await user.getIdToken();
  await fetch("/api/auth/session", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ idToken }),
  });
}
