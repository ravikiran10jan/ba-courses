import { getBucket } from "./client";

export async function generateSignedUrl(
  filePath: string,
  expiresInMinutes: number = 60
): Promise<string> {
  const [url] = await getBucket()
    .file(filePath)
    .getSignedUrl({
      version: "v4",
      action: "read",
      expires: Date.now() + expiresInMinutes * 60 * 1000,
    });
  return url;
}
