import express from "express";
import auth from "../../middlewares/auth";
import { UserRole } from "@prisma/client";
import { PaymentController } from "./payment.controller";


const router = express.Router();
// router.post("/create",PaymentController.createPayment)
router.post("/success/:id",PaymentController.successfullypaid);
router.post("/faild/:id",PaymentController.paymentFails);
router.post("/cancle/:id",PaymentController.paymentcancle);
router.get("/status/:eventId/:userId",PaymentController.getpayment );


export const PaymentRoutes = router;
