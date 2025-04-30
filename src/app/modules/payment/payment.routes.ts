import express from "express";
import auth from "../../middlewares/auth";
import { UserRole } from "@prisma/client";
import { PaymentController } from "./payment.controller";


const router = express.Router();

router.post("/initiate",PaymentController.createpayment);
router.post("/webhook", );


export const PaymentRoutes = router;
