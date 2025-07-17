import type { IGenericErrorResponse } from "../interfaces/errors.type";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const handleDuplicateError = (error: any): IGenericErrorResponse => {
  const duplicate = error.message.match(/"([^"]*)"/);
  return {
    statuscode: 400,
    message: `${duplicate[1]} already exists!!`,
  };
};
