import AppError from "../../errorHelpers/AppError";
import { type IUser } from "../user/user.interface";
import { User } from "../user/user.model";
import { StatusCodes } from "http-status-codes";
import bcrypt from "bcryptjs";
import {
  createNewAccessTokenWithRefreshToken,
  createUserTokens,
} from "../../utils/userTokens";
import type { JwtPayload } from "jsonwebtoken";
import { EnvConfig } from "../../config/env";

// Login Credential
const credentialLogin = async (payload: Partial<IUser>) => {
  const { email, password } = payload;

  if (!email || !password || typeof password !== "string") {
    throw new AppError(
      StatusCodes.BAD_REQUEST,
      "Email and password are required"
    );
  }

  const isUserExist = await User.findOne({ email });
  if (!isUserExist) {
    throw new AppError(StatusCodes.NOT_FOUND, "User is not registered yet");
  }

  const isMatchedPassword = await bcrypt.compare(
    password,
    isUserExist.password as string
  );

  if (!isMatchedPassword) {
    throw new AppError(StatusCodes.BAD_REQUEST, "Password doesn't match");
  }

  const userToken = createUserTokens(isUserExist);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { password: _pass, ...rest } = isUserExist.toObject();

  return {
    accessToken: userToken.accessToken,
    refreshToken: userToken.refreshToken,
    user: rest,
  };
};

// GEtting new Access token
const getNewAccessToken = async (refreshToken: string) => {
  const newAccessToken = await createNewAccessTokenWithRefreshToken(
    refreshToken
  );

  return {
    accessToken: newAccessToken,
  };
};

// Password Reset
const resetPassword = async (
  oldPassword: string,
  newPassword: string,
  decodedToken: JwtPayload
) => {
  const user = await User.findById(decodedToken.userId);
  if (!user) {
    throw new AppError(StatusCodes.NOT_FOUND, "User not found");
  }
  const isOldPasswordMatch = await bcrypt.compare(
    oldPassword,
    user.password as string
  );
  if (!isOldPasswordMatch) {
    throw new AppError(StatusCodes.FORBIDDEN, "Password doesn't match");
  }

  user.password = await bcrypt.hash(
    newPassword,
    Number(EnvConfig.BCRYPT_SALT_ROUND)
  );
  user.save();
};

export const AuthService = {
  credentialLogin,
  getNewAccessToken,
  resetPassword,
};
