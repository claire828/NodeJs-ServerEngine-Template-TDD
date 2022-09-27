import { NextFunction, Request, Response } from "express";
import { checkSchema, validationResult } from "express-validator";

// tofix：
export function validate(config: {}) {
  return [
    checkSchema(config),
    (req: Request, res: Response, next: NextFunction) => {
      const result = validationResult(req);
      if (result.isEmpty()) return next();

      return res.status(400).json({ errors: result.array() });
    },
  ];
}
