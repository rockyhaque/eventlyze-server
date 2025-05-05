import { StatusCodes } from "http-status-codes";
import catchAsync from "../../../shared/catchAsync";
import sendResponse from "../../../shared/sendResponse";
import { InvitationsService } from "./invitation.service";
import { JwtPayload } from "jsonwebtoken";
import { Request } from "express";
import AppError from "../../errors/AppError";
import { TAuthUser } from "../../interfaces/common";


const createInvitations = catchAsync(async (req: Request & { user?: TAuthUser }, res) => {
  const host =  req.user 
 
  

  const result = await InvitationsService.createInvitations(req.body,host as TAuthUser);
  sendResponse(res, {
    statusCode: StatusCodes.CREATED,
    success: true,
    message: "invitations Created Successfully!",
    data: result,
  });
});


const updatStatusInvitations = catchAsync(async (req: Request & { user?: TAuthUser }, res) => {
  const receveruser =  req.user 
 
  

  const result = await InvitationsService.updateStatus( req.body,receveruser as TAuthUser);
  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: "invitations update Successfully!",
    data: result,
  });
});

const getallInvitations = catchAsync(async (req: Request , res) => {
  
  const result = await InvitationsService.getallInvitations()
  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: "All  invitations get successuflly!",
    data: result,
  });
});

const gethostallInvtiations = catchAsync(async (req: Request & { user?: TAuthUser }, res) => {
  const receveruser =  req.user 
 
  const result = await InvitationsService.gethostallInvtiations(receveruser as TAuthUser);
  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: "Get host all  invitations get successuflly!",
    data: result,
  });
});






export const InvitationsController = {
  createInvitations,
  updatStatusInvitations,
  getallInvitations,
  gethostallInvtiations,

};
