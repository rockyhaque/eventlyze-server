import { StatusCodes } from "http-status-codes";
import catchAsync from "../../../shared/catchAsync";
import sendResponse from "../../../shared/sendResponse";

import { Request, Response } from "express";
import { participantService } from "./participation.service";
import { TAuthUser } from "../../interfaces/common";

// TODO: Maybe no need. Refector later
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

const getJoinedEventCategoryCount = catchAsync(
  async (req: Request, res: Response) => {
    const result = await participantService.getJoinedEventCategoryCount();
    sendResponse(res, {
      statusCode: StatusCodes.OK,
      success: true,
      message: "Joined events category fetched successfully",
      data: result,
    });
  }
);

const getAllParticipations = catchAsync(
  async (req: Request & { user?: TAuthUser }, res: Response) => {
    const user = req.user;
    const result = await participantService.getAllParticipations(
      user as TAuthUser
    );
    sendResponse(res, {
      statusCode: StatusCodes.OK,
      success: true,
      message: "All Participants fetched successfully",
      data: result,
    });
  }
);

const getHostParticipations = catchAsync(
  async (req: Request & { user?: TAuthUser }, res: Response) => {
    const user = req.user;
    const result = await participantService.getHostParticipations(
      user as TAuthUser
    );
    sendResponse(res, {
      statusCode: StatusCodes.OK,
      success: true,
      message: "All host participation fetched successfully",
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

const cancelParticipation = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await participantService.cancelParticipation(id);
  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: "Participant Cancelled Successfully!",
    data: result,
  });
});

const bannedParticipation = catchAsync(
  async (req: Request & { user?: TAuthUser }, res: Response) => {
    const { id } = req.params;
    const user = req.user;
    const result = await participantService.bannedParticipation(
      id,
      user as TAuthUser
    );
    sendResponse(res, {
      statusCode: StatusCodes.OK,
      success: true,
      message: "Participant Banned Successfully!",
      data: result,
    });
  }
);

const participantStatusUpdate = catchAsync(
  async (req: Request & { user?: TAuthUser }, res: Response) => {
    const { id } = req.params;
    const result = await participantService.participantStatusUpdate(id, req);
    sendResponse(res, {
      statusCode: StatusCodes.OK,
      success: true,
      message: "Participant status updated successfully!",
      data: result,
    });
  }
);

export const participationController = {
  getJoinedEventsByUser,
  getJoinedEventCategoryCount,
  getAllParticipations,
  getHostParticipations,
  createParticipantion,
  cancelParticipation,
  bannedParticipation,
  participantStatusUpdate,
};
