import { UserRole } from "@prisma/client";
import auth from "../../middlewares/auth";
import { eventController } from "./event.controller";

const express = require('express');
const router = express.Router();


// Create Event (only if logged in)
router.post('/', auth(UserRole.USER), eventController.createEvent);
router.get('/', eventController.getEvents);
router.get('/:id', eventController.getEventById);

export const EventRoutes = router;