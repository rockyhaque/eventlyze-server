import express from "express";
import { ReviewController } from "./review.controller";
import auth from "../../middlewares/auth";
import { UserRole } from "@prisma/client";

const router = express.Router();

// get All Review For Admin
router.get("/", auth(UserRole.ADMIN), ReviewController.getAllReviewForAdmin);

router.get("/", auth(UserRole.USER), ReviewController.getReviewsByUserId);

router.post("/", auth(UserRole.USER), ReviewController.createReview);

router.put("/:reviewId", auth(UserRole.USER), ReviewController.updateReview);

router.delete(
  "/:reviewId",
  auth(UserRole.ADMIN),
  ReviewController.deleteReview
);

export const ReviewRoutes = router;
