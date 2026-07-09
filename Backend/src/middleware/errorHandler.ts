import type { Request, Response, NextFunction } from "express";
import { ZodError } from "zod";

export function errorHandler(err: Error, _req: Request, res: Response, _next: NextFunction) {
  if (err instanceof ZodError) {
    res.status(400).json({
      message: "Validation error",
      errors: err.issues.map((e: any) => ({ path: e.path.join("."), message: e.message })),
    });
    return;
  }

  console.error(err);
  res.status(500).json({ message: "Internal server error" });
}
