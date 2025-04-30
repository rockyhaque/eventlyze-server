import express from "express";
import { UserRoutes } from "../modules/User/user.routes";
import { AuthRoutes } from "../modules/Auth/auth.routes";

const router = express.Router();

const moduleRoutes = [
  {
    path: "/user",
    route: UserRoutes,
  },
  {
    path: "/auth",
    route: AuthRoutes,
  }
];

moduleRoutes.forEach((route) => router.use(route.path, route.route));

export default router;
