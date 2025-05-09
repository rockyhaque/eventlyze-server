import express from "express";
import auth from "../../middlewares/auth";
import { UserRole } from "@prisma/client";
import { PaymentController } from "./payment.controller";

const router = express.Router();
router.get("/status/:eventId/:userId", PaymentController.getpayment);
router.post("/create", auth(UserRole.USER), PaymentController.createPayment);
router.get(
    '/ipn',
    auth(UserRole.USER), PaymentController.validatePayment
)


export const PaymentRoutes = router;
