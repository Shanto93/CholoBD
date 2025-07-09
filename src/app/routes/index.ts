import { Router } from "express";
import { UserRoute } from "../modules/user/user.route";

export const router = Router();

const moduleRouter = [
  {
    path: "/user",
    route: UserRoute,
  },
];

moduleRouter.forEach((route) => router.use(route.path, route.route));
