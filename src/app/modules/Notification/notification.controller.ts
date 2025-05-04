
import { Request, Response } from "express";
import catchAsync from "../../../shared/catchAsync";
import sendResponse from "../../../shared/sendResponse";
import { StatusCodes } from "http-status-codes";
import { notificationService } from "./notification.service";
import { TAuthUser } from "../../interfaces/common";


interface CustomRequest extends Request {
    user?: TAuthUser;
}

// Add Notification
// const addNotification = catchAsync(async (req: CustomRequest, res: Response): Promise<void> => {

//     const notification = req.body
//     const user = req.user
//     // console.log(user);
    
//     // const result = await notificationService.addNotificationIntoDB(message);
//     const result = await notificationService.addNotificationIntoDB(notification, user);

//     sendResponse(res, {
//         statusCode: StatusCodes.CREATED,
//         success: true,
//         // message: result
//         message: "Notification send succesfully",
//         data: result,
//     });
// });


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
    // addNotification,
    allNotificationByAdmin,
    allNotificationByUser
};