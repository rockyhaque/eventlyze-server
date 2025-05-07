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
router.get(
  "/chart",
  auth(UserRole.SUPER_ADMIN, UserRole.ADMIN, UserRole.USER),
  DashboardController.getChartData
);

export const DashboardRoutes = router;
