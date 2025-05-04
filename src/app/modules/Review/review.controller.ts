import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import catchAsync from "../../../shared/catchAsync";
import sendResponse from "../../../shared/sendResponse";
import { ReviewService } from "./review.service";

interface CustomRequest extends Request {
  user?: any;
}

const createReview = catchAsync(async (req: CustomRequest, res: Response) => {
  const result = await ReviewService.createReview(req.body, req.user);

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: "Review created successfully.",
    data: result,
  });
});

const getReviewsByUserId = catchAsync(
  async (req: CustomRequest, res: Response) => {
    const result = await ReviewService.getReviewsByUserId(req.user);

    sendResponse(res, {
      statusCode: StatusCodes.OK,
      success: true,
      message: "Reviews retrieved successfully.",
      data: result,
    });
  }
);

// get all reviews for admin
const getAllReviewForAdmin = catchAsync(
  async (req: CustomRequest, res: Response) => {
    const result = await ReviewService.getAllReviewForAdmin(req.user);

    sendResponse(res, {
      statusCode: StatusCodes.OK,
      success: true,
      message: "Reviews retrieved successfully for admin.",
      data: result,
    });
  }
);

const updateReview = catchAsync(async (req: CustomRequest, res: Response) => {
  const { reviewId } = req.params;

  const result = await ReviewService.updateReview(reviewId, req.body, req.user);

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: "Review updated successfully.",
    data: result,
  });
});

const deleteReview = catchAsync(async (req: CustomRequest, res: Response) => {
  const { reviewId } = req.params;

  const result = await ReviewService.deleteReview(reviewId,req.user);

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: "Review deleted successfully!",
    data: result,
  });
});

export const ReviewController = {
  createReview,
  getReviewsByUserId,
  getAllReviewForAdmin,
  updateReview,
  deleteReview,
};
