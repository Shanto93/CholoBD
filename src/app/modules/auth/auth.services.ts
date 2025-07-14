import AppError from "../../errorHelpers/AppError";
import { IsActive, type IUser } from "../user/user.interface";
import { User } from "../user/user.model";
import { StatusCodes } from "http-status-codes";
import bcrypt from "bcryptjs";
import { createUserTokens } from "../../utils/userTokens";
import { generateToken, verifyToken } from "../../utils/jwt";
import { EnvConfig } from "../../config/env";
import type { JwtPayload } from "jsonwebtoken";

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

const getNewAccessToken = async (refreshToken: string) => {
  const verifiedRefreshToken = verifyToken(
    refreshToken,
    EnvConfig.JWT_REFRESH_SECRET
  ) as JwtPayload;

  const isUserExist = await User.findOne({ email: verifiedRefreshToken.email });

  if (!isUserExist) {
    throw new AppError(StatusCodes.NOT_FOUND, "User does not exist");
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
    throw new AppError(StatusCodes.BAD_REQUEST, "User is deleted");
  }

  const jwtPayload = {
    userId: isUserExist._id,
    email: isUserExist.email,
    role: isUserExist.role,
  };

  const accessToken = generateToken(
    jwtPayload,
    EnvConfig.JWT_ACCESS_SECRET,
    EnvConfig.JWT_ACCESS_EXPIRES
  );

  return {
    accessToken,
  };
};

export const AuthService = {
  credentialLogin,
  getNewAccessToken,
};
