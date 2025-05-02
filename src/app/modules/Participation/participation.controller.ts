import { StatusCodes } from "http-status-codes";
import catchAsync from "../../../shared/catchAsync";
import sendResponse from "../../../shared/sendResponse";

import { Request, Response } from 'express';
import { participantService } from "./participation.service";

interface CustomRequest extends Request {
    user?: {
        email: string;
    };
}

const requestToJoinEvent = catchAsync(
    async (req: CustomRequest, res: Response): Promise<void> => {
        const userEmail = req.user?.email;
        const { eventId } = req.body;

        if (!userEmail) {
            throw new Error("User email is required");
        }
        const result = await participantService.handleJoinRequest(userEmail, eventId);


        sendResponse(res, {
            statusCode: StatusCodes.CREATED,
            success: true,
            message: result.message,
            data: result.data || null,
        });
    }
);


export const participationController = {
    requestToJoinEvent
};

