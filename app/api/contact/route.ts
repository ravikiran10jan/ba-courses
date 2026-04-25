import { type NextRequest } from "next/server";
import { adminDb } from "@/lib/firebase/admin";
import { contactSchema } from "@/lib/utils/validators";
import { FieldValue } from "firebase-admin/firestore";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const parsed = contactSchema.safeParse(body);
    if (!parsed.success) {
      return Response.json(
        { error: parsed.error.issues[0].message },
        { status: 400 }
      );
    }

    await adminDb.collection("contacts").add({
      ...parsed.data,
      isRead: false,
      createdAt: FieldValue.serverTimestamp(),
    });

    return Response.json(
      { message: "Message sent successfully" },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error saving contact message:", error);
    return Response.json(
      { error: "Failed to send message" },
      { status: 500 }
    );
  }
}
