
import { StatusCodes } from "http-status-codes";
import { Request } from "express";
import sendResponse from "../../../shared/sendResponse";
import { eventService } from "./event.service";
import catchAsync from "../../../shared/catchAsync";

interface CustomRequest extends Request {
    user?: any;
}


const createEvent = catchAsync(async (req: CustomRequest, res) => {
    const result = await eventService.createEvent(req.body, req.user);
    // 1. Extract email from user
    sendResponse(res, {
        statusCode: StatusCodes.OK,
        success: true,
        message: "Event Created Successfully!",
        data: result,
    });
});


export const eventController = {
    createEvent,
};