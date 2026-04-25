import { requireAdmin } from "@/lib/firebase/session";
import { uploadFile } from "@/lib/gcs/upload";

const ALLOWED_IMAGE_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
];
const MAX_IMAGE_SIZE = 5 * 1024 * 1024; // 5MB

export async function POST(request: Request) {
  try {
    await requireAdmin();

    const formData = await request.formData();
    const file = formData.get("image") as File | null;

    if (!file) {
      return Response.json({ error: "No image file provided" }, { status: 400 });
    }

    if (!ALLOWED_IMAGE_TYPES.includes(file.type)) {
      return Response.json(
        { error: "Invalid file type. Allowed: JPEG, PNG, WebP, GIF" },
        { status: 400 }
      );
    }

    if (file.size > MAX_IMAGE_SIZE) {
      return Response.json(
        { error: "File too large. Maximum size is 5MB" },
        { status: 400 }
      );
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    const extension = file.type.split("/")[1] || "jpg";
    const filename = `images/${Date.now()}-${Math.random().toString(36).substring(2, 8)}.${extension}`;

    const url = await uploadFile(buffer, filename, file.type);

    return Response.json({ url });
  } catch (error) {
    if (error instanceof Error) {
      if (error.message === "Unauthorized") {
        return Response.json({ error: "Unauthorized" }, { status: 401 });
      }
      if (error.message === "Forbidden") {
        return Response.json({ error: "Forbidden" }, { status: 403 });
      }
    }
    console.error("Error uploading image:", error);
    return Response.json(
      { error: "Failed to upload image" },
      { status: 500 }
    );
  }
}
