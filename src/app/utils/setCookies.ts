import type { Response } from "express";

interface IAuthInfo {
  accessToken?: string;
  refreshToken?: string;
}

export const setAuthCookies = (res: Response, authInfo: IAuthInfo) => {
  if (authInfo.accessToken) {
    res.cookie("accessToken", authInfo.accessToken, {
      httpOnly: true,
      secure: false,
    });
  }
  if (authInfo.refreshToken) {
    res.cookie("refreshToken", authInfo.refreshToken, {
      httpOnly: true,
      secure: false,
    });
  }
};
