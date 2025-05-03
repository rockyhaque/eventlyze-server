import { UserRole } from "@prisma/client";
import auth from "../../middlewares/auth";
import { participationController } from "./participation.controller";

const express = require("express");
const router = express.Router();

router.post(
  "/join-event",
  auth(UserRole.USER),
  participationController.createParticipantion
);

export const ParticipantRoutes = router;
