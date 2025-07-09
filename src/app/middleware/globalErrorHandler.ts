// import { NextFunction, Request, Response } from "express";
// import { EnvConfig } from "../config/env";
// import AppError from "../errorHelpers/AppError";

// export const globalErrorHandler = (
//   // eslint-disable-next-line @typescript-eslint/no-explicit-any
//   error: any,
//   req: Request,
//   res: Response,
//   // eslint-disable-next-line @typescript-eslint/no-unused-vars
//   next: NextFunction
// ) => {
//   let statuscode = 500;
//   let message = `Something went wrong ${error.message}`;
//   if (error instanceof AppError) {
//     message = error.message;
//     statuscode = error.statuscode;
//   } else if (error instanceof Error) {
//     message = error.message;
//     statuscode = 500;
//   }

//   res.status(statuscode).json({
//     success: false,
//     message: message,
//     error,
//     stack: EnvConfig.NODE_ENV === "development" ? error.stack : null,
//   });
// };

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

  if (error instanceof AppError) {
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
      error, // optional: include only in dev
    }),
  });
};
