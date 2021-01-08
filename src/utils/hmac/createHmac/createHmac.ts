import crypto from "crypto";
const ALGORITHM: string = "sha512";

export default function createHmac(payload: {}): string {
  if (!payload) throw Error("invalidate Hmac payload!");

  const digest = crypto
    .createHmac(ALGORITHM, process.env.HMAC_SECRET)
    .update(JSON.stringify(payload))
    .digest("base64");

  return digest;
}
