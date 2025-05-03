import { UserRole } from "@prisma/client";
import auth from "../../middlewares/auth";
import { participationController } from "./participation.controller";

const express = require("express");
const router = express.Router();

router.get(
  "/joined-event",
  auth(UserRole.USER),
  participationController.getJoinedEventsByUser
);

router.get(
  "/joined-all-events",
  auth(UserRole.ADMIN, UserRole.SUPER_ADMIN),
  participationController.getJoinedAllEventsByAdmin
);

router.post(
  "/join-event",
  auth(UserRole.USER),
  participationController.createParticipantion
);

export const ParticipantRoutes = router;
