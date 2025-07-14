import AppError from "../../errorHelpers/AppError";
import { type IUser } from "../user/user.interface";
import { User } from "../user/user.model";
import { StatusCodes } from "http-status-codes";
import bcrypt from "bcryptjs";
import {
  createNewAccessTokenWithRefreshToken,
  createUserTokens,
} from "../../utils/userTokens";

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
  const newAccessToken = await createNewAccessTokenWithRefreshToken(refreshToken);

  return {
    accessToken: newAccessToken,
  };
};

export const AuthService = {
  credentialLogin,
  getNewAccessToken,
};
