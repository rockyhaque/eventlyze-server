import { StatusCodes } from "http-status-codes";
import catchAsync from "../../../shared/catchAsync";
import sendResponse from "../../../shared/sendResponse";
import { SubscriberService } from "./subscriber.service";

const getAllSubscriber = catchAsync(async (req, res) => {
  const result = await SubscriberService.getAllSubscriber();
  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: "Newsletter subscribers retrieved successfull!",
    data: result,
  });
});

const createSubscriber = catchAsync(async (req, res) => {
  const result = await SubscriberService.createSubscriber(req);
  sendResponse(res, {
    statusCode: StatusCodes.CREATED,
    success: true,
    message: "Check your email please!",
    data: result,
  });
});

export const SubscriberController = {
  getAllSubscriber,
  createSubscriber,
};
