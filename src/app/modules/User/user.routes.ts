import express, { NextFunction, Request, Response } from "express";

import { UserValidation } from "./user.validation";
import { UserController } from "./user.controller";
import auth from "../../middlewares/auth";
import { UserRole } from "@prisma/client";
import validateRequest from "../../middlewares/validationRequest";
const router = express.Router();

router.get(
  "/all-users",
  auth(UserRole.SUPER_ADMIN, UserRole.ADMIN),
  UserController.getAllUserFromDB
);

router.get(
  "/me",
  auth(UserRole.SUPER_ADMIN, UserRole.ADMIN, UserRole.USER),
  UserController.myProfile
);

router.post(
  "/create-user",
  validateRequest(UserValidation.createUser),
  UserController.createUser
);

router.post(
  "/create-admin",
  validateRequest(UserValidation.createAdmin),
  UserController.createAdmin
);

router.patch(
  "/status/:id",
  auth(UserRole.SUPER_ADMIN, UserRole.ADMIN, UserRole.USER),
  UserController.changeProfileStatus
);

router.patch(
  "/update-role/:id",
  auth(UserRole.SUPER_ADMIN, UserRole.ADMIN, UserRole.USER),
  UserController.updateRole
);

router.patch(
  "/update-my-profile",
  auth(UserRole.SUPER_ADMIN, UserRole.ADMIN, UserRole.USER),
  UserController.updateMyProfile
);

export const UserRoutes = router;
