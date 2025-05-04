
import { StatusCodes } from "http-status-codes";
import { Request, Response } from "express";
import sendResponse from "../../../shared/sendResponse";
import catchAsync from "../../../shared/catchAsync";
import { eventService } from "./event.service";
import pick from "../../../shared/pick";
import { eventSearchAbleFields, userFilterableFields } from "./event.constant";

interface CustomRequest extends Request {
    user?: any;
}


const createEvent = catchAsync(async (req: CustomRequest, res:Response) => {
  
    const result = await eventService.createEvent(req.body, req.user);
    // console.log(result);
    sendResponse(res, {
        statusCode: StatusCodes.OK,
        success: true,
        message: "Event Created Successfully!",
        data: result,
    });
});



const getEvents = catchAsync(async (req: CustomRequest, res) => {
    const filters = pick(req.query,userFilterableFields );
    const options = pick(req.query, ["limit", "page", "sortBy", "sortOrder"]);
    const result = await eventService.getAllEvents(filters,options);
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

const deleteSingleEvent = catchAsync(async (req: CustomRequest, res) => {
    const { id } = req.params;
    const result = await eventService.deleteSingleEvent(id);
    sendResponse(res, {
        statusCode: StatusCodes.OK,
        success: true,
        message: "Event deleted successfully!",
        data: result,
    });
});


export const eventController = {
    createEvent,
    getEvents,
    getEventById,
    updateSingleEvent,
    deleteSingleEvent,
};