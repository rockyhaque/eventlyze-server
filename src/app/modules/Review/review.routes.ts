import express from "express";
import { ReviewController } from "./review.controller";
import auth from "../../middlewares/auth";
import { UserRole } from "@prisma/client";

const router = express.Router();

router.get("/",auth(UserRole.USER), ReviewController.getReviewsByUserId);

router.post("/",auth(UserRole.USER), ReviewController.createReview);

router.put("/:reviewId",auth(UserRole.USER), ReviewController.updateReview);

router.delete("/:reviewId", ReviewController.deleteReview);

export const ReviewRoutes = router;
