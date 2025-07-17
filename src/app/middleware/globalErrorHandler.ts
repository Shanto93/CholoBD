/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextFunction, Request, Response } from "express";
import { EnvConfig } from "../config/env";
import AppError from "../errorHelpers/AppError";

export const globalErrorHandler = (
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  error: any,
  req: Request,
  res: Response,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  next: NextFunction
) => {
  let statuscode = 500;
  let message = "Something went wrong";

  const errorSources: any = [];

  if (error.code === 11000) {
    const duplicate = error.message.match(/"([^"]*)"/);
    statuscode = 400;
    message = `${duplicate[1]} already exists!!`;
  } else if (error.name === "CastError") {
    statuscode = 400;
    message = "Invalid MongoDB ObjectID. Please provide valid ObjectID";
  } else if (error.name === "ZodError") {
    statuscode = 400;
    message = "Zod Error";
    error.issues.forEach((issue: any) => {
      errorSources.push({
        path: issue.path[issue.path.length - 1],
        message: issue.message,
      });
    });
  } else if (error.name === "ValidationError") {
    statuscode = 400;
    const errors = Object.values(error.errors);

    errors.forEach((errorobject: any) =>
      errorSources.push({
        path: errorobject.path,
        message: errorobject.message,
      })
    );
    message = "Validation Error!!";
  } else if (error instanceof AppError) {
    message = error.message;
    statuscode = error.statuscode;
  } else if (error instanceof Error) {
    message = error.message;
  }

  res.status(statuscode).json({
    success: false,
    message,
    ...(EnvConfig.NODE_ENV === "development" && {
      stack: error.stack,
      error,
      errorSources,
    }),
  });
};