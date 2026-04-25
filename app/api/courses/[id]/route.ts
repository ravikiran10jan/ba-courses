import { type NextRequest } from "next/server";
import { adminDb } from "@/lib/firebase/admin";
import { requireAdmin } from "@/lib/firebase/session";
import { courseSchema } from "@/lib/utils/validators";
import { FieldValue } from "firebase-admin/firestore";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const doc = await adminDb.collection("courses").doc(id).get();

    if (!doc.exists) {
      return Response.json({ error: "Course not found" }, { status: 404 });
    }

    return Response.json({ id: doc.id, ...doc.data() });
  } catch (error) {
    console.error("Error fetching course:", error);
    return Response.json(
      { error: "Failed to fetch course" },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await requireAdmin();
    const { id } = await params;

    const body = await request.json();
    const parsed = courseSchema.safeParse(body);
    if (!parsed.success) {
      return Response.json(
        { error: parsed.error.issues[0].message },
        { status: 400 }
      );
    }

    const doc = await adminDb.collection("courses").doc(id).get();
    if (!doc.exists) {
      return Response.json({ error: "Course not found" }, { status: 404 });
    }

    const updateData = {
      ...parsed.data,
      thumbnailUrl: body.thumbnailUrl ?? doc.data()?.thumbnailUrl ?? "",
      previewVideoUrl: body.previewVideoUrl ?? doc.data()?.previewVideoUrl ?? "",
      couponCode: body.couponCode ?? doc.data()?.couponCode ?? "",
      couponDiscount: body.couponDiscount ?? doc.data()?.couponDiscount ?? 0,
      language: body.language ?? doc.data()?.language ?? "",
      tooling: body.tooling ?? doc.data()?.tooling ?? "",
      timeRequirement: body.timeRequirement ?? doc.data()?.timeRequirement ?? "",
      commitment: body.commitment ?? doc.data()?.commitment ?? "",
      liveSessions: body.liveSessions ?? doc.data()?.liveSessions ?? "",
      certificateType: body.certificateType ?? doc.data()?.certificateType ?? "",
      instructors: body.instructors ?? doc.data()?.instructors ?? [],
      testimonials: body.testimonials ?? doc.data()?.testimonials ?? [],
      whatYouGet: body.whatYouGet ?? doc.data()?.whatYouGet ?? [],
      bonuses: body.bonuses ?? doc.data()?.bonuses ?? [],
      faqs: body.faqs ?? doc.data()?.faqs ?? [],
      whatsappLink: body.whatsappLink ?? doc.data()?.whatsappLink ?? "",
      order: body.order ?? doc.data()?.order ?? 0,
      updatedAt: FieldValue.serverTimestamp(),
    };

    await adminDb.collection("courses").doc(id).update(updateData);

    return Response.json({ id, ...updateData });
  } catch (error) {
    if (error instanceof Error) {
      if (error.message === "Unauthorized") {
        return Response.json({ error: "Unauthorized" }, { status: 401 });
      }
      if (error.message === "Forbidden") {
        return Response.json({ error: "Forbidden" }, { status: 403 });
      }
    }
    console.error("Error updating course:", error);
    return Response.json(
      { error: "Failed to update course" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await requireAdmin();
    const { id } = await params;

    const doc = await adminDb.collection("courses").doc(id).get();
    if (!doc.exists) {
      return Response.json({ error: "Course not found" }, { status: 404 });
    }

    // Delete associated lessons
    const lessonsSnapshot = await adminDb
      .collection("lessons")
      .where("courseId", "==", id)
      .get();

    const batch = adminDb.batch();
    lessonsSnapshot.docs.forEach((lessonDoc) => {
      batch.delete(lessonDoc.ref);
    });
    batch.delete(adminDb.collection("courses").doc(id));
    await batch.commit();

    return Response.json({ message: "Course deleted successfully" });
  } catch (error) {
    if (error instanceof Error) {
      if (error.message === "Unauthorized") {
        return Response.json({ error: "Unauthorized" }, { status: 401 });
      }
      if (error.message === "Forbidden") {
        return Response.json({ error: "Forbidden" }, { status: 403 });
      }
    }
    console.error("Error deleting course:", error);
    return Response.json(
      { error: "Failed to delete course" },
      { status: 500 }
    );
  }
}
