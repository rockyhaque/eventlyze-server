import express from "express";
import { SubscriberController } from "./subscriber.controller";
import auth from "../../middlewares/auth";
import { UserRole } from "@prisma/client";

const router = express.Router();

router.get("/get-all-subscribers", auth(UserRole.SUPER_ADMIN, UserRole.ADMIN), SubscriberController.getAllSubscriber)

router.post(
  "/",
  //   validateRequest(subscriberValidation.subscriberSchema),
  SubscriberController.createSubscriber
);

export const SubscriberRoutes = router;
