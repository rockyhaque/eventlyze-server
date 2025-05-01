
import { StatusCodes } from "http-status-codes";
import catchAsync from "../../../shared/catchAsync";
import sendResponse from "../../../shared/sendResponse";
import { eventService } from "./event.service";


const createEvent = catchAsync(async (req, res) => {
    console.log(req.body);
    const result = await eventService.createEvent(req.body);
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