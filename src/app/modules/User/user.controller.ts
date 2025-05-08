import { StatusCodes } from "http-status-codes";
import catchAsync from "../../../shared/catchAsync";
import { UserService } from "./user.service";
import sendResponse from "../../../shared/sendResponse";
import { userFilterableFields } from "./user.constant";
import { Request, Response } from "express";
import pick from "../../../shared/pick";
import { TAuthUser } from "../../interfaces/common";

const createUser = catchAsync(async (req, res) => {
  const result = await UserService.createUser(req);
  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: "User Created Successfully!",
    data: result,
  });
});

const createAdmin = catchAsync(async (req, res) => {
  const result = await UserService.createAdmin(req);
  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: "Admin Created Successfully!",
    data: result,
  });
});

const getUserStats = catchAsync(async(req: Request & { user?: TAuthUser }, res: Response) => {
  const user = req.user;
  const result = await UserService.getUserStats(user);
  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: "User Stats retrieved Successfully!",
    data: result,
  });
})

const getAllUserFromDB = catchAsync(async (req: Request, res: Response) => {
  const filters = pick(req.query, userFilterableFields);
  const options = pick(req.query, ["limit", "page", "sortBy", "sortOrder"]);

  const result = await UserService.getAllUserFromDB(filters, options);

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: "Users data retrieved successfully!",
    meta: result.meta,
    data: result.data,
  });
});

const getSingleUserFromDB = catchAsync(async (req: Request, res: Response) => {
  const {id} = req.params;

  const result = await UserService.getSingleUserFromDB(id);

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: "User retrieved successfully!",
    data: result,
  });
});

const myProfile = catchAsync(
  async (req: Request & { user?: TAuthUser }, res: Response) => {
    const user = req.user;

    const result = await UserService.myProfile(user as TAuthUser);

    sendResponse(res, {
      statusCode: StatusCodes.OK,
      success: true,
      message: "My Profile retrieved successfully!",
      data: result,
    });
  }
);

const changeProfileStatus = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await UserService.changeProfileStatus(id, req.body);

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: "Users profile status changed!",
    data: result,
  });
});

const updateRole = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await UserService.updateRole(id, req.body);

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: "Role is updated successfully",
    data: result,
  });
});

const updateMyProfile = catchAsync(
  async (req: Request & { user?: TAuthUser }, res: Response) => {
    const user = req.user;

    const result = await UserService.updateMyProfile(user as TAuthUser, req);

    sendResponse(res, {
      statusCode: StatusCodes.OK,
      success: true,
      message: "My Profile is updated successfully!",
      data: result,
    });
  }
);

export const UserController = {
  createUser,
  createAdmin,
  getUserStats,
  getAllUserFromDB,
  getSingleUserFromDB,
  myProfile,
  changeProfileStatus,
  updateRole,
  updateMyProfile,
};
