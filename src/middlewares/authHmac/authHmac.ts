import { NextFunction, Request, Response } from "express";
import IHmacPayload from "../../utils/hmac/common/IHmacPayload.js";
import verifySign from "../../utils/hmac/verifySign/verifySign.js";

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
