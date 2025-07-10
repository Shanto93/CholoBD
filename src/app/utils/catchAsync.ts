/* eslint-disable @typescript-eslint/no-unused-vars */
import { Request, NextFunction, Response } from "express";

type TAsyncHandler = (
  req: Request,
  res: Response,
  next: NextFunction
) => Promise<void>;

export const catchAsync =
  (fn: TAsyncHandler) => (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch((error) => {
    //   console.log(error);
      next(error);
    });
  };
