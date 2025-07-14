import AppError from "../../errorHelpers/AppError";
import { IsActive, type IUser } from "../user/user.interface";
import { User } from "../user/user.model";
import { StatusCodes } from "http-status-codes";
import bcrypt from "bcryptjs";
import { createUserTokens } from "../../utils/userTokens";
import { verifyToken } from "../../utils/jwt";
import { EnvConfig } from "../../config/env";
import type { JwtPayload } from "jsonwebtoken";

const credentialLogin = async (payload: Partial<IUser>) => {
  const { email, password } = payload;

  const isUserExist = await User.findOne({ email });
  if (!isUserExist) {
    throw new AppError(StatusCodes.NOT_FOUND, "User is not registered yet");
  }

  const isMatchedPassword = await bcrypt.compare(
    password as string,
    isUserExist.password as string
  );

  if (!isMatchedPassword) {
    throw new AppError(StatusCodes.BAD_REQUEST, "Password doesn't matched");
  }

  const userToken = createUserTokens(isUserExist);

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { password: pass, ...rest } = isUserExist.toObject();
  return {
    accessToken: userToken.accessToken,
    refreshToken: userToken.refreshToken,
    user: rest,
  };
};
const getNewAccessToken = async (refreshToken: string) => {
  const verifiedRefreshToken = verifyToken(
    refreshToken,
    EnvConfig.JWT_REFRESH_EXPIRE
  ) as JwtPayload;

  const isUserExist = await User.findOne({ email: verifiedRefreshToken.email });

  if (!isUserExist) {
    throw new AppError(StatusCodes.NOT_FOUND, "User does not exists");
  }

  if (
    isUserExist.isActive === IsActive.BLOCKED ||
    isUserExist.isActive === IsActive.INACTIVE
  ) {
    throw new AppError(
      StatusCodes.BAD_REQUEST,
      `User is ${isUserExist.isActive}`
    );
  }

  if (isUserExist.isDelete) {
    throw new AppError(StatusCodes.BAD_REQUEST, `User is Deleted`);
  }

  const accessToken = createUserTokens(isUserExist).accessToken;

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { password: pass, ...rest } = isUserExist.toObject();
  return {
    accessToken: accessToken,
  };
};

export const AuthService = {
  credentialLogin,
  getNewAccessToken,
};
