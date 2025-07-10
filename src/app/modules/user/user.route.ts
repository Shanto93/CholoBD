/* eslint-disable @typescript-eslint/no-unused-vars */
import { Router } from "express";
import { UserController } from "./user.controller";
import { validateRequest } from "../../middleware/validateRequest";
import { userCreateZodSchema } from "./user.validation";

const router = Router();

router.post("/register", validateRequest(userCreateZodSchema), UserController.createUser);
router.get("/all-users", UserController.getAllUsers);

export const UserRoute = router;
