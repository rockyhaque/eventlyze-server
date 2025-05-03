import { StatusCodes } from "http-status-codes";
import catchAsync from "../../../shared/catchAsync";
import sendResponse from "../../../shared/sendResponse";

import { Request, Response } from "express";
import { participantService } from "./participation.service";
import { TAuthUser } from "../../interfaces/common";

const getJoinedEventsByUser = catchAsync(
  async (req: Request & { user?: TAuthUser }, res: Response) => {
    const user = req.user;
    const result = await participantService.getJoinedEventsByUser(
      user as TAuthUser
    );
    sendResponse(res, {
      statusCode: StatusCodes.OK,
      success: true,
      message: "Joined events fetched successfully",
      data: result,
    });
  }
);

const getJoinedAllEventsByAdmin = catchAsync(
  async (req: Request, res: Response) => {
    const result = await participantService.getJoinedAllEventsByAdmin();
    sendResponse(res, {
      statusCode: StatusCodes.OK,
      success: true,
      message: "All Joined events fetched successfully",
      data: result,
    });
  }
);

const createParticipantion = catchAsync(
  async (req: Request & { user?: TAuthUser }, res: Response) => {
    const user = req.user;
    const result = await participantService.createParticipation(
      req.body,
      user as TAuthUser
    );
    sendResponse(res, {
      statusCode: StatusCodes.CREATED,
      success: true,
      message: "Participant joined Successfully!",
      data: result,
    });
  }
);

const cancelParticipation = catchAsync(
  async (req: Request, res: Response) => {
    const { id } = req.params;
    const result = await participantService.cancelParticipation(
        id
    );
    sendResponse(res, {
      statusCode: StatusCodes.OK,
      success: true,
      message: "Participant Cancelled Successfully!",
      data: result,
    });
  }
);

export const participationController = {
  getJoinedEventsByUser,
  getJoinedAllEventsByAdmin,
  createParticipantion,
  cancelParticipation
};
