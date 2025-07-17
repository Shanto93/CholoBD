/* eslint-disable @typescript-eslint/no-unused-vars */
import type { NextFunction, Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { StatusCodes } from "http-status-codes";
import { sendResponse } from "../../utils/sendResponse";
import { AuthService } from "./auth.services";
import AppError from "../../errorHelpers/AppError";
import { createUserTokens } from "./../../utils/userTokens";
import { setAuthCookies } from "./../../utils/setCookies";
import { EnvConfig } from "../../config/env";
import type { JwtPayload } from "jsonwebtoken";
import passport from "passport";

const credentialLogin = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    passport.authenticate("local", async (error: any, user: any, info: any) => {
      try {
        if (error) {
          return next(new AppError(401, error));
        }
        if (!user) {
          return next(new AppError(401, info.message));
        }

        const userTokens = await createUserTokens(user);
        const { password, ...rest } = user.toObject();

        setAuthCookies(res, userTokens);

        sendResponse(res, {
          statuscode: StatusCodes.OK,
          success: true,
          message: "User logged in successfully",
          data: {
            accessToken: userTokens.accessToken,
            refreshToken: userTokens.refreshToken,
            user: rest,
          },
        });
      } catch (error) {
        next(error);
      }
    })(req, res, next);
  }
);

const getNewAccessToken = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const refreshToken = req.cookies.refreshToken;

    if (!refreshToken) {
      throw new AppError(StatusCodes.UNAUTHORIZED, "Refresh token missing");
    }

    const tokenInfo = await AuthService.getNewAccessToken(refreshToken);
    setAuthCookies(res, tokenInfo);

    sendResponse(res, {
      statuscode: StatusCodes.OK,
      success: true,
      message: "New access token generated successfully",
      data: tokenInfo,
    });
  }
);

const logout = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    res.clearCookie("accessToken", {
      httpOnly: true,
      secure: false,
      sameSite: "lax",
    });
    res.clearCookie("refreshToken", {
      httpOnly: true,
      secure: false,
      sameSite: "lax",
    });
    sendResponse(res, {
      statuscode: StatusCodes.OK,
      success: true,
      message: "User Logged out successfully",
      data: null,
    });
  }
);

const resetPassword = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const decodedToken = req.user;
    const newPassword = req.body.newPassword;
    const oldPassword = req.body.oldPassword;
    await AuthService.resetPassword(
      oldPassword,
      newPassword,
      decodedToken as JwtPayload
    );

    sendResponse(res, {
      statuscode: StatusCodes.OK,
      success: true,
      message: "Password changed successfully",
      data: null,
    });
  }
);
const googleCallbackController = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    let redirectTo = req.query.state ? (req.query.state as string) : "";

    if (redirectTo.startsWith("/")) {
      redirectTo = redirectTo.slice(1);
    }
    const user = req.user;
    console.log("user", user);
    if (!user) {
      throw new AppError(StatusCodes.NOT_FOUND, "No user found");
    }
    const tokenInfo = await createUserTokens(user);
    setAuthCookies(res, tokenInfo);

    res.redirect(`${EnvConfig.FRONTEND_URL}/${redirectTo}`);
  }
);

export const AuthControllers = {
  credentialLogin,
  getNewAccessToken,
  logout,
  resetPassword,
  googleCallbackController,
};
