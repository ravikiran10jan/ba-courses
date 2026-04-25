import { type NextRequest } from "next/server";
import { adminDb } from "@/lib/firebase/admin";
import { requireAuth } from "@/lib/firebase/session";
import { FieldValue } from "firebase-admin/firestore";

export async function POST(request: NextRequest) {
  try {
    const user = await requireAuth();
    const { lessonId, courseId } = await request.json();

    if (!lessonId || !courseId) {
      return Response.json(
        { error: "lessonId and courseId are required" },
        { status: 400 }
      );
    }

    // Find the enrollment
    const enrollmentSnapshot = await adminDb
      .collection("enrollments")
      .where("userId", "==", user.uid)
      .where("courseId", "==", courseId)
      .limit(1)
      .get();

    if (enrollmentSnapshot.empty) {
      return Response.json(
        { error: "Enrollment not found" },
        { status: 404 }
      );
    }

    const enrollmentDoc = enrollmentSnapshot.docs[0];
    const enrollment = enrollmentDoc.data();

    // Check if lesson is already completed
    if (enrollment.completedLessons?.includes(lessonId)) {
      return Response.json({ message: "Lesson already completed" });
    }

    // Add lesson to completed list
    const updatedCompletedLessons = [
      ...(enrollment.completedLessons || []),
      lessonId,
    ];

    // Calculate new progress
    const totalLessons = enrollment.totalLessons || 1;
    const progressPercent = Math.round(
      (updatedCompletedLessons.length / totalLessons) * 100
    );
    const isCompleted = updatedCompletedLessons.length >= totalLessons;

    const updateData: Record<string, unknown> = {
      completedLessons: FieldValue.arrayUnion(lessonId),
      progressPercent,
      isCompleted,
      updatedAt: FieldValue.serverTimestamp(),
    };

    if (isCompleted) {
      updateData.completedAt = FieldValue.serverTimestamp();
    }

    await enrollmentDoc.ref.update(updateData);

    // Auto-create achievement on course completion
    if (isCompleted) {
      try {
        // Check if achievement already exists
        const existingAchievement = await adminDb
          .collection("achievements")
          .where("userId", "==", user.uid)
          .where("courseId", "==", courseId)
          .where("type", "==", "course_completion")
          .limit(1)
          .get();

        if (existingAchievement.empty) {
          await adminDb.collection("achievements").add({
            userId: user.uid,
            courseId,
            courseTitle: enrollment.courseTitle || "",
            type: "course_completion",
            certificateUrl: "",
            earnedAt: FieldValue.serverTimestamp(),
          });
        }
      } catch (achievementError) {
        // Log but don't fail the main request
        console.error("Error creating achievement:", achievementError);
      }
    }

    return Response.json({
      progressPercent,
      isCompleted,
      completedLessons: updatedCompletedLessons,
    });
  } catch (error) {
    if (error instanceof Error && error.message === "Unauthorized") {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }
    console.error("Error updating progress:", error);
    return Response.json(
      { error: "Failed to update progress" },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const enrollmentId = request.nextUrl.searchParams.get("enrollmentId");

    if (!enrollmentId) {
      return Response.json(
        { error: "enrollmentId is required" },
        { status: 400 }
      );
    }

    const doc = await adminDb
      .collection("enrollments")
      .doc(enrollmentId)
      .get();

    if (!doc.exists) {
      return Response.json(
        { error: "Enrollment not found" },
        { status: 404 }
      );
    }

    const enrollment = doc.data()!;

    return Response.json({
      id: doc.id,
      completedLessons: enrollment.completedLessons || [],
      totalLessons: enrollment.totalLessons || 0,
      progressPercent: enrollment.progressPercent || 0,
      isCompleted: enrollment.isCompleted || false,
      completedAt: enrollment.completedAt || null,
    });
  } catch (error) {
    console.error("Error fetching progress:", error);
    return Response.json(
      { error: "Failed to fetch progress" },
      { status: 500 }
    );
  }
}
