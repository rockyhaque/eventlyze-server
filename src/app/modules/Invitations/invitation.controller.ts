import { StatusCodes } from "http-status-codes";
import catchAsync from "../../../shared/catchAsync";
import sendResponse from "../../../shared/sendResponse";
import { InvitationsService } from "./invitation.service";
import { Request } from "express";
import { TAuthUser } from "../../interfaces/common";

const createInvitations = catchAsync(
  async (req: Request & { user?: TAuthUser }, res) => {
    const host = req.user;

    const {eventId} = req.params;
    const result = await InvitationsService.createInvitations(
      req.body.email,
      eventId,
      host as TAuthUser
    );
    sendResponse(res, {
      statusCode: StatusCodes.CREATED,
      success: true,
      message: "Invitations Created Successfully!",
      data: result,
    });
  }
);

const updatStatusInvitations = catchAsync(
  async (req: Request & { user?: TAuthUser }, res) => {
    const receiveruser = req.user;

    const result = await InvitationsService.updateStatus(
      req.body,
      receiveruser as TAuthUser
    );
    sendResponse(res, {
      statusCode: StatusCodes.OK,
      success: true,
      message: "Invitations update Successfully!",
      data: result,
    });
  }
);

const getallInvitations = catchAsync(async (req: Request, res) => {
  const result = await InvitationsService.getallInvitations();
  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: "All  invitations get successuflly!",
    data: result,
  });
});

const getHostAllInvitations = catchAsync(
  async (req: Request & { user?: TAuthUser }, res) => {
    const receveruser = req.user;

    const result = await InvitationsService.getHostAllInvitations(
      receveruser as TAuthUser
    );
    sendResponse(res, {
      statusCode: StatusCodes.OK,
      success: true,
      message: "Get all invitations get successuflly!",
      data: result,
    });
  }
);

const getParticipantAllInvtiations = catchAsync(
  async (req: Request & { user?: TAuthUser }, res) => {
    const participantUser = req.user;

    const result = await InvitationsService.getParticipantAllInvtiations(
      participantUser as TAuthUser
    );
    sendResponse(res, {
      statusCode: StatusCodes.OK,
      success: true,
      message: "Get all participant invitations retrieved successuflly!",
      data: result,
    });
  }
);

export const InvitationsController = {
  createInvitations,
  updatStatusInvitations,
  getallInvitations,
  getHostAllInvitations,
  getParticipantAllInvtiations
};
