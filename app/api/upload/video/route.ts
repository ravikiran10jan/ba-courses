import { requireAdmin } from "@/lib/firebase/session";
import { uploadPrivateFile } from "@/lib/gcs/upload";

const ALLOWED_VIDEO_TYPES = ["video/mp4", "video/webm", "video/quicktime"];
const MAX_VIDEO_SIZE = 500 * 1024 * 1024; // 500MB

export async function POST(request: Request) {
  try {
    await requireAdmin();

    const formData = await request.formData();
    const file = formData.get("video") as File | null;

    if (!file) {
      return Response.json({ error: "No video file provided" }, { status: 400 });
    }

    if (!ALLOWED_VIDEO_TYPES.includes(file.type)) {
      return Response.json(
        { error: "Invalid file type. Allowed: MP4, WebM, QuickTime" },
        { status: 400 }
      );
    }

    if (file.size > MAX_VIDEO_SIZE) {
      return Response.json(
        { error: "File too large. Maximum size is 500MB" },
        { status: 400 }
      );
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    const extension = file.name.split(".").pop() || "mp4";
    const filename = `videos/${Date.now()}-${Math.random().toString(36).substring(2, 8)}.${extension}`;

    const path = await uploadPrivateFile(buffer, filename, file.type);

    return Response.json({ path });
  } catch (error) {
    if (error instanceof Error) {
      if (error.message === "Unauthorized") {
        return Response.json({ error: "Unauthorized" }, { status: 401 });
      }
      if (error.message === "Forbidden") {
        return Response.json({ error: "Forbidden" }, { status: 403 });
      }
    }
    console.error("Error uploading video:", error);
    return Response.json(
      { error: "Failed to upload video" },
      { status: 500 }
    );
  }
}
