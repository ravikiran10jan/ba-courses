import { type NextRequest } from "next/server";
import { adminDb } from "@/lib/firebase/admin";
import { requireAdmin } from "@/lib/firebase/session";
import { courseSchema } from "@/lib/utils/validators";
import { FieldValue } from "firebase-admin/firestore";

export async function GET() {
  try {
    const snapshot = await adminDb
      .collection("courses")
      .where("isPublished", "==", true)
      .orderBy("order", "asc")
      .get();

    const courses = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    return Response.json(courses);
  } catch (error) {
    console.error("Error fetching courses:", error);
    return Response.json(
      { error: "Failed to fetch courses" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    await requireAdmin();

    const body = await request.json();
    const parsed = courseSchema.safeParse(body);
    if (!parsed.success) {
      return Response.json(
        { error: parsed.error.issues[0].message },
        { status: 400 }
      );
    }

    const courseData = {
      ...parsed.data,
      thumbnailUrl: body.thumbnailUrl || "",
      previewVideoUrl: body.previewVideoUrl || "",
      couponCode: body.couponCode || "",
      couponDiscount: body.couponDiscount || 0,
      enrolledCount: 0,
      language: body.language || "",
      tooling: body.tooling || "",
      timeRequirement: body.timeRequirement || "",
      commitment: body.commitment || "",
      liveSessions: body.liveSessions || "",
      certificateType: body.certificateType || "",
      instructors: body.instructors || [],
      testimonials: body.testimonials || [],
      whatYouGet: body.whatYouGet || [],
      bonuses: body.bonuses || [],
      faqs: body.faqs || [],
      whatsappLink: body.whatsappLink || "",
      order: body.order || 0,
      createdAt: FieldValue.serverTimestamp(),
      updatedAt: FieldValue.serverTimestamp(),
    };

    const docRef = await adminDb.collection("courses").add(courseData);

    return Response.json(
      { id: docRef.id, ...courseData },
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
    console.error("Error creating course:", error);
    return Response.json(
      { error: "Failed to create course" },
      { status: 500 }
    );
  }
}
