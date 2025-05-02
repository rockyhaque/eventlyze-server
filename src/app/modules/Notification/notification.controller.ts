
import { Request, Response } from "express";
import catchAsync from "../../../shared/catchAsync";
import sendResponse from "../../../shared/sendResponse";
import { StatusCodes } from "http-status-codes";
import { notificationService } from "./notification.service";


// Add Notification
const addNotification = catchAsync(async (req: Request, res: Response): Promise<void> => {

    const result = await notificationService.addNotificationIntoDB();

    sendResponse(res, {
        statusCode: StatusCodes.CREATED,
        success: true,
        message: result.message,
        data: result,
    });
}
);


export const NotificationController = {
    addNotification,
};