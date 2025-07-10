/* eslint-disable @typescript-eslint/no-unused-vars */
import { Request, Response, type NextFunction } from "express";
import { StatusCodes } from "http-status-codes";
import { UserServices } from "./user.services";
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";

const createUser = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const user = await UserServices.createUser(req.body);
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

export const UserController = {
  createUser,
  getAllUsers,
};
