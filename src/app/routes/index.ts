import { Router } from "express";
import { UserRoute } from "../modules/user/user.route";
import { AuthRoute } from "../modules/auth/auth.route";

export const router = Router();

const moduleRouter = [
  {
    path: "/user",
    route: UserRoute,
  },
  {
    path: "/auth",
    route: AuthRoute,
  },
];

moduleRouter.forEach((route) => router.use(route.path, route.route));
