import { Storage } from "@google-cloud/storage";

let storage: Storage | null = null;

export function getStorage(): Storage {
  if (!storage) {
    storage = new Storage({
      projectId: process.env.GCS_PROJECT_ID,
      credentials: {
        client_email: process.env.GCS_CLIENT_EMAIL,
        private_key: process.env.GCS_PRIVATE_KEY?.replace(/\\n/g, "\n"),
      },
    });
  }
  return storage;
}

export function getBucket() {
  return getStorage().bucket(process.env.GCS_BUCKET_NAME || "ba-courses-media");
}
