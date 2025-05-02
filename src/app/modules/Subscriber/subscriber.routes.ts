import express from "express";
import { SubscriberController } from "./subscriber.controller";

const router = express.Router();

router.post(
  "/",
  //   validateRequest(subscriberValidation.subscriberSchema),
  SubscriberController.createSubscriber
);

export const SubscriberRoutes = router;
