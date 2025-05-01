import express from "express";
import { UserRole } from "@prisma/client";
import auth from "../../middlewares/auth";
import { AdminController } from "./admin.controller";

const router = express.Router();

router.delete(
  "/permanent-delete/:id",
  auth(UserRole.SUPER_ADMIN, UserRole.ADMIN),
  AdminController.permanentDeleteUser
);

router.delete(
  "/soft-delete/:id",
  auth(UserRole.SUPER_ADMIN, UserRole.ADMIN),
  AdminController.softUserDelete
);

export const adminRoutes = router;