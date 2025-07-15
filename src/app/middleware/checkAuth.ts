import { NextFunction, Request, Response } from "express";
import AppError from "../errorHelpers/AppError";
import { verifyToken } from "../utils/jwt";
import { EnvConfig } from "../config/env";
import type { JwtPayload } from "jsonwebtoken";
import { User } from "../modules/user/user.model";
import { StatusCodes } from "http-status-codes";
import { IsActive } from "../modules/user/user.interface";

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

      const isUserExist = await User.findOne({ email: verifiedToken.email });

      if (!isUserExist) {
        throw new AppError(StatusCodes.NOT_FOUND, "User does not exist");
      }

      if (
        isUserExist.isActive === IsActive.BLOCKED ||
        isUserExist.isActive === IsActive.INACTIVE
      ) {
        throw new AppError(
          StatusCodes.BAD_REQUEST,
          `User is ${isUserExist.isActive}`
        );
      }

      if (isUserExist.isDelete) {
        throw new AppError(StatusCodes.BAD_REQUEST, "User is deleted");
      }

      req.user = verifiedToken;

      next();
    } catch (error) {
      next(error);
    }
  };