
import { Request, Response } from "express";
import catchAsync from "../../../shared/catchAsync";
import sendResponse from "../../../shared/sendResponse";
import { StatusCodes } from "http-status-codes";



const addNotification = catchAsync( async (req: Request, res: Response): Promise<void> => {
        
        const result = await participantService.handleJoinRequest();


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