import { EnvConfig } from "../config/env";
import type { IUser } from "../modules/user/user.interface";
import { generateToken } from "./jwt";

export const createUserTokens = (user: Partial<IUser>) => {
  const jwtPayload = {
    userId: user._id,
    email: user.email,
    role: user.role,
  };

  const accessToken = generateToken(
    jwtPayload,
    EnvConfig.JWT_ACCESS_SECRET,
    EnvConfig.JWT_ACCESS_EXPIRES
  );

  const refreshToken = generateToken(
    jwtPayload,
    EnvConfig.JWT_REFRESH_SECRET,
    EnvConfig.JWT_REFRESH_EXPIRE
  );

  return {
    accessToken,
    refreshToken,
  };
};
