import { StatusCodes } from "http-status-codes";
import catchAsync from "../../../shared/catchAsync";
import sendResponse from "../../../shared/sendResponse";
import { SubscriberService } from "./subscriber.service";

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
  createSubscriber,
};
