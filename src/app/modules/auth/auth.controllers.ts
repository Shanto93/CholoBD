/* eslint-disable @typescript-eslint/no-unused-vars */
import type { NextFunction, Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { StatusCodes } from "http-status-codes";
import { sendResponse } from "../../utils/sendResponse";
import { AuthService } from "./auth.services";
import AppError from "../../errorHelpers/AppError";

const credentialLogin = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const loginInfo = await AuthService.credentialLogin(req.body);

    res.cookie("accessToken", loginInfo.accessToken, {
      httpOnly: true,
      secure: false,
    });
    res.cookie("refreshToken", loginInfo.refreshToken, {
      httpOnly: true,
      secure: false,
    });

    sendResponse(res, {
      statuscode: StatusCodes.OK,
      success: true,
      message: "User logged in successfully",
      data: loginInfo,
    });
  }
);

const getNewAccessToken = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const refreshToken = req.cookies.refreshToken;

    if (!refreshToken) {
      throw new AppError(StatusCodes.UNAUTHORIZED, "Refresh token missing");
    }

    const tokenInfo = await AuthService.getNewAccessToken(refreshToken);

    sendResponse(res, {
      statuscode: StatusCodes.OK,
      success: true,
      message: "New access token generated successfully",
      data: tokenInfo,
    });
  }
);

export const AuthControllers = {
  credentialLogin,
  getNewAccessToken,
};
