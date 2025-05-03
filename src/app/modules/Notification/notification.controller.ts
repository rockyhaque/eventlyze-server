
import { Request, Response } from "express";
import catchAsync from "../../../shared/catchAsync";
import sendResponse from "../../../shared/sendResponse";
import { StatusCodes } from "http-status-codes";
import { notificationService } from "./notification.service";


// Add Notification
const addNotification = catchAsync(async (req: Request, res: Response): Promise<void> => {

    // const data = req.body.message;
    // const user = req.user
    // console.log(user);
    

    // console.log(req.user);
    
  
    // const result = await notificationService.addNotificationIntoDB(message);
    const result = await notificationService.addNotificationIntoDB(req as any);

    sendResponse(res, {
        statusCode: StatusCodes.CREATED,
        success: true,
        // message: result
        message: "Notification send succesfully",
        data: result,
    });
});


// All Notification by Admin
const allNotificationByAdmin = catchAsync(async (req: Request, res: Response): Promise<void> => {

    const result = await notificationService.allNotificatoinByAdminIntoDB();

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
    addNotification,
    allNotificationByAdmin,
    allNotificationByUser
};