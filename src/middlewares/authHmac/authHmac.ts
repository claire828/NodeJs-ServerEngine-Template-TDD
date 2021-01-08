import { NextFunction, Request, Response } from "express";
import IHmacPayload from "../../utils/hmac/common/IHmacPayload";
import verifySign from "../../utils/hmac/verifySign/verifySign";

export default function authHmac(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const data = req.method === "GET" ? req.query : req.body;
  const struct: IHmacPayload = data as IHmacPayload;
  if (struct.payload && struct.signature) {
    const correct = verifySign(struct);
    if (correct) return next();
  }

  return res.status(400).json("Validate HMAC-PAYLOAD failed");
}
/*

   const data = req.method === "GET" ? req.query : req.body;
  const { payload, signature } = data;
  if (!payload || !signature)
    return res.status(400).json({ error: "invalidate payload" });

  // obtain a buffer digest
  const digest = createHmac(payload);

  // Transform the signature to buffer
  // 這個 signature是hmac的payload
  const checkSum = Buffer.from(signature, "base64");

  // Compare signature with the calculated digest
  // 藉由我們加密過的簽名比對整個payload. (簽名就是payload的hmac)
  // 所以比對結果需要正確才對
  if (
    checkSum.length === digest.length &&
    crypto.timingSafeEqual(digest, checkSum)
  ) {
    return next();
  }

  return res.status(401).json("invalidate Hmac");*/
