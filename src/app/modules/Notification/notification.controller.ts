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
        message: "Get all admin Notification  succesfully",
        data: result,
    });
});


// All Notification by user
const allNotificationByUser = catchAsync(async (req: Request, res: Response): Promise<void> => {

    const result = await notificationService.allNotificatoinByUserIntoDB();

    sendResponse(res, {
        statusCode: StatusCodes.OK,
        success: true,
        // message: result.message,
        message: "Get All User Notification succesfully",
        data: result,
    });
});



export const NotificationController = {
    allNotification,
    allNotificationByUser
};
