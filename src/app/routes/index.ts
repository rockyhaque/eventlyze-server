import express from "express";
import { UserRoutes } from "../modules/User/user.routes";
import { AuthRoutes } from "../modules/Auth/auth.routes";
import { PaymentRoutes } from "../modules/payment/payment.routes";

const router = express.Router();

const moduleRoutes = [
  {
    path: "/user",
    route: UserRoutes,
  },
  {
    path: "/auth",
    route: AuthRoutes,
  },{
    path: "/payments",
    route:PaymentRoutes,
  }
];

moduleRoutes.forEach((route) => router.use(route.path, route.route));

export default router;
