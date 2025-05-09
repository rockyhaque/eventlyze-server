import express from "express";
import auth from "../../middlewares/auth";
import { UserRole } from "@prisma/client";
import { InvitationsController } from "./invitation.controller";

const router = express.Router();


router.get('/all-invitations',auth(UserRole.ADMIN,UserRole.SUPER_ADMIN),InvitationsController.getallInvitations)
router.get('/all-host-invitations',auth(UserRole.USER), InvitationsController.gethostallInvtiations)
router.get('/all-participant-invitations',auth(UserRole.USER), InvitationsController.getParticipantAllInvtiations)

router.post(
  "/:eventId",
  auth(UserRole.USER),
  InvitationsController.createInvitations
);

router.patch(
  '/update-status',
  auth(UserRole.USER),
  InvitationsController.updatStatusInvitations
)





export const InvitationsRoutes = router;
