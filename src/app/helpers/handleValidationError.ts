/* eslint-disable @typescript-eslint/no-explicit-any */
import type {
  IErrorSources,
  IGenericErrorResponse,
} from "../interfaces/errors.type";

export const handleValidationError = (error: any): IGenericErrorResponse => {
  const errorSources: IErrorSources[] = [];

  const errors = Object.values(error.errors);

  errors.forEach((errorobject: any) =>
    errorSources.push({
      path: errorobject.path,
      message: errorobject.message,
    })
  );

  return {
    statuscode: 400,
    message: "Validation Error!!",
  };
};
