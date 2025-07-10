import type { NextFunction, Request, Response } from "express";
import type { AnyZodObject } from "zod";

export const validateRequest =
  (zodScheme: AnyZodObject) =>
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      req.body = await zodScheme.parseAsync(req.body);
      next();
    } catch (error) {
      next(error);
    }
  };
