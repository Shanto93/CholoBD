/* eslint-disable @typescript-eslint/no-unused-vars */
import { Request, Response, type NextFunction } from "express";
import { StatusCodes } from "http-status-codes";
import { UserServices } from "./user.services";
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";
import { User } from "./user.model";
import type { IAuthProvider } from "./user.interface";
import bcrypt from "bcryptjs";
import { EnvConfig } from "../../config/env";
import AppError from "../../errorHelpers/AppError";

const createUser = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { email, password, ...rest } = req.body;

    const userAvailable = await User.findOne({ email });
    // if (userAvailable) {
    //   throw new AppError(
    //     StatusCodes.BAD_REQUEST,
    //     "User already exist in database"
    //   );
    // }

    const hashPassword = await bcrypt.hash(
      password,
      Number(EnvConfig.BCRYPT_SALT_ROUND)
    );

    const authProvider: IAuthProvider = {
      provider: "credential",
      providerId: email,
    };

    const user = await UserServices.createUser({
      email,
      password: hashPassword,
      auths: [authProvider],
      ...rest,
    });
    sendResponse(res, {
      statuscode: StatusCodes.CREATED,
      success: true,
      message: "User created Successfully",
      data: user,
    });
  }
);

const getAllUsers = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const users = await UserServices.getAllUsers();
    sendResponse(res, {
      statuscode: StatusCodes.OK,
      success: true,
      message: "Users retrived Successfully",
      data: users.users,
      meta: { total: users.total },
    });
  }
);

const updateUser = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const userId = req.params.id;
    const payload = req.body;
    // const token = req.headers.authorization;
    // const verifiedToken = verifyToken(
    //   token as string,
    //   EnvConfig.JWT_ACCESS_SECRET
    // ) as JwtPayload;

    const verifiedToken = req.user;

    if (!verifiedToken) {
      throw new AppError(StatusCodes.UNAUTHORIZED, "User doesn't exists!!!");
    }

    const updatedUser = await UserServices.updateUser(
      userId,
      payload,
      verifiedToken
    );
    sendResponse(res, {
      statuscode: StatusCodes.OK,
      success: true,
      message: "User updated Successfully",
      data: updatedUser,
    });
  }
);

export const UserController = {
  createUser,
  getAllUsers,
  updateUser,
};
