import { type NextRequest } from "next/server";
import { adminDb } from "@/lib/firebase/admin";
import { enterpriseDemoSchema } from "@/lib/utils/validators";
import { FieldValue } from "firebase-admin/firestore";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const parsed = enterpriseDemoSchema.safeParse(body);
    if (!parsed.success) {
      return Response.json(
        { error: parsed.error.issues[0].message },
        { status: 400 }
      );
    }

    await adminDb.collection("enterpriseDemos").add({
      ...parsed.data,
      createdAt: FieldValue.serverTimestamp(),
    });

    return Response.json(
      { message: "Demo request submitted successfully" },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error saving enterprise demo request:", error);
    return Response.json(
      { error: "Failed to submit demo request" },
      { status: 500 }
    );
  }
}
