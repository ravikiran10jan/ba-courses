import { type NextRequest } from "next/server";
import { adminDb } from "@/lib/firebase/admin";
import { requireAdmin } from "@/lib/firebase/session";
import { lessonSchema } from "@/lib/utils/validators";
import { FieldValue } from "firebase-admin/firestore";

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await requireAdmin();
    const { id } = await params;

    const body = await request.json();
    const parsed = lessonSchema.safeParse(body);
    if (!parsed.success) {
      return Response.json(
        { error: parsed.error.issues[0].message },
        { status: 400 }
      );
    }

    const doc = await adminDb.collection("lessons").doc(id).get();
    if (!doc.exists) {
      return Response.json({ error: "Lesson not found" }, { status: 404 });
    }

    const updateData: Record<string, unknown> = {
      ...parsed.data,
      updatedAt: FieldValue.serverTimestamp(),
    };

    if (body.videoPath !== undefined) {
      updateData.videoPath = body.videoPath;
    }
    if (body.duration !== undefined) {
      updateData.duration = body.duration;
    }

    await adminDb.collection("lessons").doc(id).update(updateData);

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
    console.error("Error updating lesson:", error);
    return Response.json(
      { error: "Failed to update lesson" },
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

    const doc = await adminDb.collection("lessons").doc(id).get();
    if (!doc.exists) {
      return Response.json({ error: "Lesson not found" }, { status: 404 });
    }

    await adminDb.collection("lessons").doc(id).delete();

    return Response.json({ message: "Lesson deleted successfully" });
  } catch (error) {
    if (error instanceof Error) {
      if (error.message === "Unauthorized") {
        return Response.json({ error: "Unauthorized" }, { status: 401 });
      }
      if (error.message === "Forbidden") {
        return Response.json({ error: "Forbidden" }, { status: 403 });
      }
    }
    console.error("Error deleting lesson:", error);
    return Response.json(
      { error: "Failed to delete lesson" },
      { status: 500 }
    );
  }
}
