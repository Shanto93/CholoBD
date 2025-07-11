import type { JwtPayload } from "jsonwebtoken";
import { Role, type IUser } from "./user.interface";
import { User } from "./user.model";
import AppError from "../../errorHelpers/AppError";
import { StatusCodes } from "http-status-codes";
import { EnvConfig } from "../../config/env";
import bcrypt from "bcryptjs";

const createUser = async (payload: Partial<IUser>) => {
  const user = await User.create(payload);
  return user;
};

const getAllUsers = async () => {
  const users = await User.find({});
  const total = await User.countDocuments();
  return { users, total };
};

const updateUser = async (
  userId: string,
  payload: Partial<IUser>,
  decodedToken: JwtPayload
) => {
  const isUserExist = await User.findById(userId);
  if (!isUserExist) {
    throw new AppError(StatusCodes.NOT_FOUND, "User not found");
  }

  if (payload.role) {
    if (decodedToken.role === Role.USER || decodedToken.role === Role.GUIDE) {
      throw new AppError(StatusCodes.FORBIDDEN, "User not found");
    }
  }
  if (payload.role === Role.SUPER_ADMIN && decodedToken.role === Role.ADMIN) {
    throw new AppError(
      StatusCodes.FORBIDDEN,
      "You are not authorized to update"
    );
  }

  if (payload.isActive || payload.isDelete || payload.isVerified) {
    if (decodedToken.role === Role.USER || decodedToken.role === Role.GUIDE) {
      throw new AppError(StatusCodes.FORBIDDEN, "You are not authorized");
    }
  }

  if (payload.password) {
    payload.password = await bcrypt.hash(
      payload.password,
      Number(EnvConfig.BCRYPT_SALT_ROUND)
    );
  }

  const newUpdateUser = await User.findByIdAndUpdate(userId, payload, {
    new: true,
    runValidators: true,
  });

  return newUpdateUser;
};

export const UserServices = {
  createUser,
  getAllUsers,
  updateUser,
};
