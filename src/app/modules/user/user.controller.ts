import { Request, Response, type NextFunction } from "express";
import { StatusCodes } from "http-status-codes";
import { UserServices } from "./user.services";

const createUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user = await UserServices.createUser(req.body);


    res.status(StatusCodes.CREATED).json({
      message: "User created successfully",
      data: user,
    });
  } catch (error) {
    next(error);
  }
};

export const UserController = {
  createUser,
};
