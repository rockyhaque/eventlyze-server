import express from "express";
import auth from "../../middlewares/auth";
import { UserRole } from "@prisma/client";
import { PaymentController } from "./payment.controller";

const router = express.Router();
router.get("/status/:eventId/:userId", PaymentController.getPayment);
router.post("/success/:id",PaymentController.paymentSuccess);
router.post("/failed/:id",PaymentController.paymentFailed);
router.post("/cancel/:id",PaymentController.paymentCancel);
router.post("/create", auth(UserRole.USER), PaymentController.createPayment);
router.get(
    '/ipn',
    auth(UserRole.USER), PaymentController.validatePayment
)


export const PaymentRoutes = router;
