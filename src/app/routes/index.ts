import { Router } from "express";
import { UserRoute } from "../modules/user/user.route";
import { AuthRoute } from "../modules/auth/auth.route";
import { DivisionRoutes } from "../modules/division/division.routes";
import { TourRoutes } from "../modules/tour/tour.route";

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
  {
    path: "/division",
    route: DivisionRoutes,
  },
  {
    path: "/tour",
    route: TourRoutes,
  },
];

moduleRouter.forEach((route) => router.use(route.path, route.route));
