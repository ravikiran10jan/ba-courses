import { cookies } from "next/headers";
import { adminAuth } from "@/lib/firebase/admin";

export async function POST(request: Request) {
  try {
    const { idToken } = await request.json();

    if (!idToken) {
      return Response.json({ error: "Missing idToken" }, { status: 400 });
    }

    // Verify the ID token with Firebase Admin
    await adminAuth.verifyIdToken(idToken);

    // Set session cookie
    const cookieStore = await cookies();
    cookieStore.set("ba-courses-session", idToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 14, // 14 days
    });

    return Response.json({ success: true });
  } catch (error) {
    console.error("Session creation error:", error);
    return Response.json({ error: "Failed to create session" }, { status: 401 });
  }
}

export async function DELETE() {
  try {
    const cookieStore = await cookies();
    cookieStore.delete("ba-courses-session");

    return Response.json({ success: true });
  } catch (error) {
    console.error("Session deletion error:", error);
    return Response.json({ error: "Failed to delete session" }, { status: 500 });
  }
}
