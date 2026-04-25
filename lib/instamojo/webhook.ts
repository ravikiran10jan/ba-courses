import crypto from "crypto";

const SALT = process.env.INSTAMOJO_SALT || "";

export function verifyWebhookSignature(
  data: Record<string, string>,
  mac: string
): boolean {
  const sortedKeys = Object.keys(data).sort();
  const message = sortedKeys.map((key) => data[key]).join("|");
  const expectedMac = crypto
    .createHmac("sha1", SALT)
    .update(message)
    .digest("hex");
  return expectedMac === mac;
}
