import { type NextRequest } from "next/server";
import { adminDb } from "@/lib/firebase/admin";
import { requireAuth } from "@/lib/firebase/session";
import { generateSignedUrl } from "@/lib/gcs/signed-url";

export async function GET(request: NextRequest) {
  try {
    const user = await requireAuth();
    const lessonId = request.nextUrl.searchParams.get("lessonId");

    if (!lessonId) {
      return Response.json(
        { error: "lessonId is required" },
        { status: 400 }
      );
    }

    // Fetch the lesson
    const lessonDoc = await adminDb.collection("lessons").doc(lessonId).get();
    if (!lessonDoc.exists) {
      return Response.json({ error: "Lesson not found" }, { status: 404 });
    }

    const lesson = lessonDoc.data()!;

    // Allow access if lesson is a preview
    if (!lesson.isPreview) {
      // Verify user is enrolled in the course
      const enrollmentSnapshot = await adminDb
        .collection("enrollments")
        .where("userId", "==", user.uid)
        .where("courseId", "==", lesson.courseId)
        .limit(1)
        .get();

      if (enrollmentSnapshot.empty) {
        return Response.json(
          { error: "You are not enrolled in this course" },
          { status: 403 }
        );
      }
    }

    if (!lesson.videoPath) {
      return Response.json(
        { error: "No video available for this lesson" },
        { status: 404 }
      );
    }

    const url = await generateSignedUrl(lesson.videoPath, 120);

    return Response.json({ url });
  } catch (error) {
    if (error instanceof Error && error.message === "Unauthorized") {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }
    console.error("Error generating video URL:", error);
    return Response.json(
      { error: "Failed to generate video URL" },
      { status: 500 }
    );
  }
}
