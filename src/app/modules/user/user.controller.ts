import { Request, Response } from "express";
import { User } from "./user.model";
import { StatusCodes } from "http-status-codes";

const createUser = async (req: Request, res: Response) => {
  try {
    const { name, email } = req.body;
    const user = await User.create({ name, email });
    res.status(StatusCodes.CREATED).json({
      message: "User created Successfully",
      data: user,
    });
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    res
      .status(StatusCodes.BAD_GATEWAY)
      .json({ message: `Something went wrong ${error.message}` });
  }
};

export const UserController = {
  createUser,
};
