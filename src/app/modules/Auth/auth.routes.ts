import express from "express";

import auth from "../../middlewares/auth";
import { UserRole } from "@prisma/client";
import { AuthController } from "./auth.controller";

const router = express.Router();

router.post("/login", AuthController.loginUser);
router.post("/refresh-token", AuthController.refreshToken);
router.post(
  "/change-password",
  auth(UserRole.SUPER_ADMIN, UserRole.ADMIN, UserRole.USER),
  AuthController.changePassword
);
router.post("/forgot-password", AuthController.forgotPassword);
router.post(
  "/reset-password",
  auth(UserRole.SUPER_ADMIN, UserRole.ADMIN, UserRole.USER),
  AuthController.resetPassword
);

export const AuthRoutes = router;
