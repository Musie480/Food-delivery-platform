import type { Request, Response, NextFunction } from "express";

export function catchAsync(
  fn: (req: Request, res: Response, next: NextFunction) => void | Promise<void>,
) {
  return (req: Request, res: Response, next: NextFunction) =>
    Promise.resolve(fn(req, res, next)).catch(next);
}
