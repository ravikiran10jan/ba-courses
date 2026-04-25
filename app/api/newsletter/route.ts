import { type NextRequest } from "next/server";
import { adminDb } from "@/lib/firebase/admin";
import { newsletterSchema } from "@/lib/utils/validators";
import { FieldValue } from "firebase-admin/firestore";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const parsed = newsletterSchema.safeParse(body);
    if (!parsed.success) {
      return Response.json(
        { error: parsed.error.issues[0].message },
        { status: 400 }
      );
    }

    // Use email as doc ID for deduplication
    const docRef = adminDb.collection("newsletter").doc(parsed.data.email);
    const existing = await docRef.get();

    if (existing.exists) {
      return Response.json({ message: "Already subscribed" });
    }

    await docRef.set({
      email: parsed.data.email,
      subscribedAt: FieldValue.serverTimestamp(),
    });

    return Response.json(
      { message: "Subscribed successfully" },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error subscribing to newsletter:", error);
    return Response.json(
      { error: "Failed to subscribe" },
      { status: 500 }
    );
  }
}
