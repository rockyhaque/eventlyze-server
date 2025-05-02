import { UserRole } from "@prisma/client";
import auth from "../../middlewares/auth";
import { participationController } from "./participation.controller";

;

const express = require('express');
const router = express.Router();


// Create Event (only if logged in)
router.post('/join-event', auth(UserRole.USER), participationController.requestToJoinEvent);


export const ParticipantRoutes = router;