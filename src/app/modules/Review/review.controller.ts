import { StatusCodes } from "http-status-codes";
import catchAsync from "../../../shared/catchAsync";
import sendResponse from "../../../shared/sendResponse";
import { ReviewService } from "./review.service";

const createReview = catchAsync(async (req, res) => {
  const { eventId } = req.params;

  const result = await ReviewService.createReview(eventId, req.body);

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: "Review created Successfully.",
    data: result,
  });
});

const getReviews = catchAsync(async (req, res) => {
  const { eventId } = req.params;

  const result = await ReviewService.getReviews(eventId);

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: "Reviews retrieved successfully.",
    data: result,
  });
});

const updateReview = catchAsync(async (req, res) => {
  const { reviewId } = req.params;

  const result = await ReviewService.updateReview(reviewId, req.body);

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: "Review updated successfully.",
    data: result,
  });
});

const deleteReview = catchAsync(async (req, res) => {
  const { reviewId } = req.params;

  const result = await ReviewService.deleteReview(reviewId);

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: "Review deleted successfully!",
    data: result,
  });
});

export const ReviewController = {
  createReview,
  getReviews,
  updateReview,
  deleteReview,
};
