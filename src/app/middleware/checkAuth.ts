import { NextFunction, Request, Response } from "express";
import AppError from "../errorHelpers/AppError";
import { verifyToken } from "../utils/jwt";
import { EnvConfig } from "../config/env";
import type { JwtPayload } from "jsonwebtoken";

export const checkAuth =
  (...authRole: string[]) =>
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const accessToken = req.headers.authorization;
      if (!accessToken) {
        throw new AppError(403, "No Token received");
      }
      const verifiedToken = verifyToken(
        accessToken,
        EnvConfig.JWT_ACCESS_SECRET
      ) as JwtPayload;
      if (!verifiedToken) {
        throw new AppError(404, "Verify Token is not found");
      }

      if (!authRole.includes(verifiedToken.role)) {
        throw new AppError(403, "You are not permitted to view this route");
      }

      next();
    } catch (error) {
      next(error);
    }
  };
