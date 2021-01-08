import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";

export const SECRET = process.env.JWT_SECRET;
interface Idecode {
  exp: number;
  name?: string;
}
/* Authorization的格式通常由 Token 類型（Type）+ 空格 ＋JWT 所組成：
   such as: Authorization: <type> <credentials>
   JWT 是一種 Bearer Token，因此在Authorization帶入：
   Authorization: 'Bearer ' + token */
// JWT最好要使用在https的伺服器才安全。
// 目前這邊就Method.Get + Header
// 如果要Post + body 那要再另外改一下下
export default function authJWT(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const [schema, token] = req.headers?.authorization?.split(" ") ?? [];
  if (!token || schema.toLowerCase() !== "bearer") {
    return res.status(403).json({ error: "unauthorize JWT" });
  }

  // 這邊做驗證
  jwt.verify(token, process.env.JWT_SECRET, (err, decode: Idecode) => {
    if (err) return res.status(401).json({ err: err.message });
    if (!decode.exp) return res.status(401).json({ err: "expired time" });

    return next();
  });
}
