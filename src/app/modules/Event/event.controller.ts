
import { StatusCodes } from "http-status-codes";
import { Request } from "express";
import sendResponse from "../../../shared/sendResponse";
import catchAsync from "../../../shared/catchAsync";
import { eventService } from "./event.service";

interface CustomRequest extends Request {
    user?: any;
}


const createEvent = catchAsync(async (req: CustomRequest, res) => {
    const result = await eventService.createEvent(req.body, req.user);
    sendResponse(res, {
        statusCode: StatusCodes.OK,
        success: true,
        message: "Event Created Successfully!",
        data: result,
    });
});



const getEvents = catchAsync(async (req: CustomRequest, res) => {
    const result = await eventService.getAllEvents.getFilteredEvents(req.query);
    sendResponse(res, {
        statusCode: StatusCodes.OK,
        success: true,
        message: "Events retrieved successfully!",
        data: result,
    });
});


const getEventById = catchAsync(async (req: CustomRequest, res) => {
    const { id } = req.params;
    const result = await eventService.getEventById(id);
    sendResponse(res, {
        statusCode: StatusCodes.OK,
        success: true,
        message: "Event retrieved successfully!",
        data: result,
    });
});

const updateSingleEvent = catchAsync(async (req: CustomRequest, res) => {
    const { id } = req.params;
    const result = await eventService.updateSingleEvent(id, req.body);
    sendResponse(res, {
        statusCode: StatusCodes.OK,
        success: true,
        message: "Event updated successfully!",
        data: result,
    });
});


export const eventController = {
    createEvent,
    getEvents,
    getEventById,
    updateSingleEvent,
};