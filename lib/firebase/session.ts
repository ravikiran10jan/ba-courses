import { adminAuth, adminDb } from "./admin";
import { cookies } from "next/headers";

export async function getSessionUser() {
  const cookieStore = await cookies();
  const session = cookieStore.get("ba-courses-session")?.value;
  if (!session) return null;
  try {
    const decoded = await adminAuth.verifyIdToken(session);
    return decoded;
  } catch {
    return null;
  }
}

export async function requireAuth() {
  const user = await getSessionUser();
  if (!user) throw new Error("Unauthorized");
  return user;
}

export async function requireAdmin() {
  const user = await requireAuth();
  const doc = await adminDb.collection("users").doc(user.uid).get();
  if (!doc.exists || doc.data()?.role !== "admin") {
    throw new Error("Forbidden");
  }
  return user;
}
