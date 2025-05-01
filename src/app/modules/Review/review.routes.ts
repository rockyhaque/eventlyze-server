import express from "express";
import { ReviewController } from "./review.controller";

const router = express.Router();

router.get("/:eventId", ReviewController.getReviews);

router.post("/:eventId", ReviewController.createReview);

router.put("/:reviewId", ReviewController.updateReview);

router.delete("/:reviewId", ReviewController.deleteReview);

export const ReviewRoutes = router;
