import express from "express";
import auth from "../../middlewares/auth";
import { UserRole } from "@prisma/client";
import { DashboardController } from "./dashboard.controller";

const router = express.Router();
router.get(
  "/stats",
  auth(UserRole.SUPER_ADMIN, UserRole.ADMIN, UserRole.USER),
  DashboardController.getStatsBasedOnRole
);

export const DashboardRoutes = router;
