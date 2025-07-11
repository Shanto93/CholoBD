import type { NextFunction, Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { StatusCodes } from "http-status-codes";
import { sendResponse } from "./../../utils/sendResponse";
import { AuthService } from "./auth.services";

const credentialLogin = catchAsync(
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async (req: Request, res: Response, next: NextFunction) => {
    const loginInfo = await AuthService.credentialLogin(req.body);

    sendResponse(res, {
      statuscode: StatusCodes.OK,
      success: true,
      message: "User Loggedin Successfully",
      data: loginInfo,
    });
  }
);

export const AuthControllers = {
  credentialLogin,
};
