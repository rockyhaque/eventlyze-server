import { UserRole } from "@prisma/client";
import auth from "../../middlewares/auth";
import { eventController } from "./event.controller";
import { EventValidiontonSchema } from "./event.validation";
import validateRequest from "../../middlewares/validationRequest";

const express = require('express');
const router = express.Router();


// Create Event (only if logged in)
router.post('/', auth(UserRole.USER),validateRequest(EventValidiontonSchema.EventSchema), eventController.createEvent);
router.get('/all-events', eventController.getEvents);
router.get('/:id', eventController.getEventById);
router.put('/:id', auth(UserRole.USER), eventController.updateSingleEvent); // Assuming this is for updating the event
router.delete('/:id', auth(UserRole.USER), eventController.deleteSingleEvent); // Assuming this is for deleting the event

export const EventRoutes = router;