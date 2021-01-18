import crypto from "crypto";
import IHmacPayload from "../common/IHmacPayload";
import createHmac from "../createHmac/createHmac";

export default function verifySign(data: IHmacPayload): boolean {
  // obtain a buffer digest
  const hmac = createHmac(data.payload).toString();
  const digest = Buffer.from(hmac, "base64");
  // Transform the signature to buffer
  // 這個 signature是hmac的payload
  const checkSum = Buffer.from(JSON.stringify(data.signature), "base64");

  // Compare signature with the calculated digest
  // 藉由我們加密過的簽名比對整個payload. (簽名就是payload的hmac)
  // 所以比對結果需要正確才對
  return (
    checkSum.length === digest.length &&
    crypto.timingSafeEqual(digest, checkSum)
  );
}
