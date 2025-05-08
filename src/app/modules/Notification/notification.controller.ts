import { StatusCodes } from "http-status-codes";
import catchAsync from "../../../shared/catchAsync";
import sendResponse from "../../../shared/sendResponse";
import { notificationService } from "./notification.service";
import { Request, Response } from "express";

interface CustomRequest extends Request {
    user?: any;
}


// All Notification
const allNotification = catchAsync(async (req: CustomRequest, res: Response): Promise<void> => {

    const result = await notificationService.allNotificatoinIntoDB(req.user);

    sendResponse(res, {
        statusCode: StatusCodes.OK,
        success: true,
        // message: result.message,
        message: "Get all Notification  succesfully",
        data: result,
    });
});


// Update Single Notification
const updateSingleNotificatoin = catchAsync(async (req: CustomRequest, res: Response): Promise<void> => {

    const { id } = req.params;

    const result = await notificationService.updateSingleNotificatoinIntoDB(req.user, id);

    sendResponse(res, {
        statusCode: StatusCodes.OK,
        success: true,
        // message: result.message,
        message: "This notification read succesfully",
        data: result,
    });
});

// Update Notification
const updateAllNotificatoin = catchAsync(async (req: CustomRequest, res: Response): Promise<void> => {

    const result = await notificationService.updateAllNotificatoinIntoDB(req.user);

    sendResponse(res, {
        statusCode: StatusCodes.OK,
        success: true,
        // message: result.message,
        message: "All notification read succesfully",
        data: result,
    });
});



export const NotificationController = {
    allNotification,
    updateAllNotificatoin,
    updateSingleNotificatoin
};
