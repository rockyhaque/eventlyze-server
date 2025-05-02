import express, { NextFunction, Request, Response } from "express";
import { fileUploader } from "../../../helpers/fileUploader";
import { UserValidation } from "./user.validation";
import { UserController } from "./user.controller";
import auth from "../../middlewares/auth";
import { UserRole } from "@prisma/client";
const router = express.Router();
// demo
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
  fileUploader.upload.single("file"),
  (req: Request, res: Response, next: NextFunction) => {
    req.body = UserValidation.createUser.parse(JSON.parse(req.body.data));
    return UserController.createUser(req, res, next);
  }
);

router.post(
  "/create-admin",
  fileUploader.upload.single("file"),
  (req: Request, res: Response, next: NextFunction) => {
    req.body = UserValidation.createAdmin.parse(JSON.parse(req.body.data));
    return UserController.createAdmin(req, res, next);
  }
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
  fileUploader.upload.single("file"),
  (req: Request, res: Response, next: NextFunction) => {
    req.body = JSON.parse(req.body.data);
    return UserController.updateMyProfile(req, res, next);
  }
);

export const UserRoutes = router;
