import { type NextRequest } from "next/server";
import { adminDb } from "@/lib/firebase/admin";
import { requireAdmin } from "@/lib/firebase/session";
import { lessonSchema } from "@/lib/utils/validators";
import { FieldValue } from "firebase-admin/firestore";

export async function GET(request: NextRequest) {
  try {
    const courseId = request.nextUrl.searchParams.get("courseId");
    if (!courseId) {
      return Response.json(
        { error: "courseId is required" },
        { status: 400 }
      );
    }

    const snapshot = await adminDb
      .collection("lessons")
      .where("courseId", "==", courseId)
      .orderBy("weekNumber", "asc")
      .orderBy("order", "asc")
      .get();

    const lessons = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    return Response.json(lessons);
  } catch (error) {
    console.error("Error fetching lessons:", error);
    return Response.json(
      { error: "Failed to fetch lessons" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    await requireAdmin();

    const body = await request.json();
    const parsed = lessonSchema.safeParse(body);
    if (!parsed.success) {
      return Response.json(
        { error: parsed.error.issues[0].message },
        { status: 400 }
      );
    }

    if (!body.courseId) {
      return Response.json(
        { error: "courseId is required" },
        { status: 400 }
      );
    }

    // Verify course exists
    const courseDoc = await adminDb
      .collection("courses")
      .doc(body.courseId)
      .get();
    if (!courseDoc.exists) {
      return Response.json({ error: "Course not found" }, { status: 404 });
    }

    const lessonData = {
      ...parsed.data,
      courseId: body.courseId,
      videoPath: body.videoPath || "",
      duration: body.duration || 0,
      createdAt: FieldValue.serverTimestamp(),
    };

    const docRef = await adminDb.collection("lessons").add(lessonData);

    return Response.json(
      { id: docRef.id, ...lessonData },
      { status: 201 }
    );
  } catch (error) {
    if (error instanceof Error) {
      if (error.message === "Unauthorized") {
        return Response.json({ error: "Unauthorized" }, { status: 401 });
      }
      if (error.message === "Forbidden") {
        return Response.json({ error: "Forbidden" }, { status: 403 });
      }
    }
    console.error("Error creating lesson:", error);
    return Response.json(
      { error: "Failed to create lesson" },
      { status: 500 }
    );
  }
}
