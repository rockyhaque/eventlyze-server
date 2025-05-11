import { UserRole } from "@prisma/client";
import auth from "../../middlewares/auth";
import { participationController } from "./participation.controller";

const express = require("express");
const router = express.Router();

// TODO: Maybe no need. Refector later
router.get(
  "/joined-event",
  auth(UserRole.USER, UserRole.ADMIN, UserRole.SUPER_ADMIN),
  participationController.getJoinedEventsByUser
);

router.get(
  "/joined-event-category-stats",
  auth(UserRole.ADMIN, UserRole.SUPER_ADMIN, UserRole.USER),
  participationController.getJoinedEventCategoryCount
);

router.get(
  "/all-participants",
  auth(UserRole.ADMIN, UserRole.SUPER_ADMIN, UserRole.USER),
  participationController.getAllParticipations
);

router.post(
  "/join-event",
  auth(UserRole.USER),
  participationController.createParticipantion
);

router.patch(
  "/update-status/:id",
  auth(UserRole.USER),
  participationController.participantStatusUpdate
);

router.delete(
  "/cancel-participation/:id",
  auth(UserRole.USER),
  participationController.cancelParticipation
);

router.delete(
  "/banned-participation/:id",
  auth(UserRole.USER),
  participationController.bannedParticipation
);

export const ParticipantRoutes = router;
