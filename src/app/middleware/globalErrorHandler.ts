/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */

import { NextFunction, Request, Response } from "express";
import { EnvConfig } from "../config/env";
import AppError from "../errorHelpers/AppError";
import type { IErrorSources } from "../interfaces/errors.type";
import { handleDuplicateError } from "../helpers/handleDuplicateError";
import { handleCastError } from "../helpers/handleCastError";
import { handleZodError } from "../helpers/handleZodError";
import { handleValidationError } from "../helpers/handleValidationError";

export const globalErrorHandler = (
  error: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  let statuscode = 500;
  let message = "Something went wrong";

  let errorSources: IErrorSources[] = [];

  if (error.code === 11000) {
    const simplifiedError = handleDuplicateError(error);
    statuscode = simplifiedError.statuscode;
    message = simplifiedError.message;
  } else if (error.name === "CastError") {
    const simplifiedError = handleCastError(error);

    statuscode = simplifiedError.statuscode;
    message = simplifiedError.message;
  } else if (error.name === "ZodError") {
    const simplifiedError = handleZodError(error);
    statuscode = simplifiedError.statuscode;
    message = simplifiedError.message;
    errorSources = simplifiedError.errorSources as IErrorSources[];
  } else if (error.name === "ValidationError") {
    const simplifiedError = handleValidationError(error);
    statuscode = simplifiedError.statuscode;
    message = simplifiedError.message;
    errorSources = simplifiedError.errorSources as IErrorSources[];
  } else if (error instanceof AppError) {
    message = error.message;
    statuscode = error.statuscode;
  } else if (error instanceof Error) {
    message = error.message;
  }

  res.status(statuscode).json({
    success: false,
    message,
    errorSources,
    ...(EnvConfig.NODE_ENV === "development" && {
      stack: error.stack,
      error,
    }),
  });
};
