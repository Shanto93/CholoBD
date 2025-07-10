/* eslint-disable @typescript-eslint/no-unused-vars */
import { Router, NextFunction, Request, Response } from "express";
import { UserController } from "./user.controller";
import z from "zod";
import { userZodSchema } from "./user.validation";

const router = Router();

router.post(
  "/register",
  async (req: Request, res: Response, next: NextFunction) => {
    req.body = await userZodSchema.parseAsync(req.body);
    next();
  },
  UserController.createUser
);
router.get("/all-users", UserController.getAllUsers);

export const UserRoute = router;
