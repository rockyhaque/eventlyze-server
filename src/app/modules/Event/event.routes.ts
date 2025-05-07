import { UserRole } from "@prisma/client";
import auth from "../../middlewares/auth";
import { eventController } from "./event.controller";
import { EventValidiontonSchema } from "./event.validation";
import validateRequest from "../../middlewares/validationRequest";

const express = require("express");
const router = express.Router();

router.get("/event-category-stats", eventController.getEventCategoryCount);
router.get("/all-events", eventController.getEvents);
router.get("/:id", eventController.getEventById);

router.post(
  "/",
  auth(UserRole.USER),
  validateRequest(EventValidiontonSchema.EventSchema),
  eventController.createEvent
);
router.put("/:id", auth(UserRole.USER), eventController.updateSingleEvent);
router.delete("/:id", auth(UserRole.USER), eventController.deleteSingleEvent);
router.delete(
  "/banned-event/:id",
  auth(UserRole.ADMIN, UserRole.SUPER_ADMIN),
  eventController.bannedEvent
);

export const EventRoutes = router;
