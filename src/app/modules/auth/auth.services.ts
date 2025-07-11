import AppError from "../../errorHelpers/AppError";
import type { IUser } from "../user/user.interface";
import { User } from "../user/user.model";
import { StatusCodes } from "http-status-codes";
import bcrypt from "bcryptjs";
import { EnvConfig } from "../../config/env";
import { generateToken } from "../../utils/jwt";

const credentialLogin = async (payload: Partial<IUser>) => {
  const { email, password } = payload;

  const isUserAvailable = await User.findOne({ email });
  if (!isUserAvailable) {
    throw new AppError(StatusCodes.NOT_FOUND, "User is not registered yet");
  }

  const isMatchedPassword = await bcrypt.compare(
    password as string,
    isUserAvailable.password as string
  );

  if (!isMatchedPassword) {
    throw new AppError(StatusCodes.BAD_REQUEST, "Password doesn't matched");
  }

  const jwtPayload = {
    userId: isUserAvailable._id,
    email: isUserAvailable.email,
    role: isUserAvailable.role,
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
};
