import type mongoose from "mongoose";
import type { IGenericErrorResponse } from "../interfaces/errors.type";

export const handleCastError = (
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  error: mongoose.Error.CastError
): IGenericErrorResponse => {
  return {
    statuscode: 400,
    message: "Invalid MongoDB ObjectID. Please provide valid ObjectID",
  };
};