import { getBucket } from "./client";

export async function uploadFile(
  buffer: Buffer,
  destination: string,
  contentType: string
): Promise<string> {
  const file = getBucket().file(destination);
  await file.save(buffer, { contentType, resumable: false });
  await file.makePublic();
  return `https://storage.googleapis.com/${process.env.GCS_BUCKET_NAME}/${destination}`;
}

export async function uploadPrivateFile(
  buffer: Buffer,
  destination: string,
  contentType: string
): Promise<string> {
  const file = getBucket().file(destination);
  await file.save(buffer, { contentType, resumable: false });
  return destination;
}
