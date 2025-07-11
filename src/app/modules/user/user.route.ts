/* eslint-disable @typescript-eslint/no-unused-vars */
import { Router } from "express";
import { UserController } from "./user.controller";
import { validateRequest } from "../../middleware/validateRequest";
import { userCreateZodSchema } from "./user.validation";

import { checkAuth } from "../../middleware/checkAuth";
import { Role } from "./user.interface";

const router = Router();

router.post(
  "/register",
  validateRequest(userCreateZodSchema),
  UserController.createUser
);
router.get(
  "/all-users",
  checkAuth(Role.ADMIN, Role.SUPER_ADMIN),
  UserController.getAllUsers
);

router.patch(
  "/:id",
  checkAuth(...Object.values(Role)),
  UserController.updateUser
);

export const UserRoute = router;
