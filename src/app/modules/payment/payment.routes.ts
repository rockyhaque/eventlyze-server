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

router.post("/success/:id", PaymentController.successfullypaid);
router.post("/faild/:id", PaymentController.paymentFails);
router.post("/cancle/:id", PaymentController.paymentcancle);

export const PaymentRoutes = router;
