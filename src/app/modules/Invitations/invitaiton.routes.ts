import express from "express";
import auth from "../../middlewares/auth";
import { UserRole } from "@prisma/client";
import { InvitationsController } from "./invitation.controller";

const router = express.Router();

router.post(
  "/",
  auth(UserRole.USER),
  InvitationsController.createInvitations
);

router.patch(
  '/updateStatus',
  auth(UserRole.USER),
  InvitationsController.updatStatusInvitations
)



export const InvitationsRoutes = router;
