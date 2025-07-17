/* eslint-disable @typescript-eslint/no-explicit-any */
import type {
  IErrorSources,
  IGenericErrorResponse,
} from "../interfaces/errors.type";

export const handleZodError = (error: any): IGenericErrorResponse => {
  const errorSources: IErrorSources[] = [];

  error.issues.forEach((issue: any) => {
    errorSources.push({
      path: issue.path[issue.path.length - 1],
      message: issue.message,
    });
  });
  return {
    statuscode: 400,
    message: "Zod Error",
    errorSources,
  };
};
