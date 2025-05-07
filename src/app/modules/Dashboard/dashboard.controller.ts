import { StatusCodes } from "http-status-codes";
import catchAsync from "../../../shared/catchAsync";
import { TAuthUser } from "../../interfaces/common";
import { AdminService } from "../Admin/admin.service";
import sendResponse from "../../../shared/sendResponse";
import { Request, Response } from "express";
import { UserService } from "../User/user.service";
import AppError from "../../errors/AppError";
import { UserRole } from "@prisma/client";
import { DashboardService } from "./dashboard.service";

const getAdminStats = catchAsync(
  async (req: Request & { user?: TAuthUser }, res: Response) => {
    const user = req.user;
    const result = await AdminService.getAdminStats(user);
    sendResponse(res, {
      statusCode: StatusCodes.OK,
      success: true,
      message: "Admin Stats retrieved Successfully!",
      data: result,
    });
  }
);

const getUserStats = catchAsync(
  async (req: Request & { user?: TAuthUser }, res: Response) => {
    const user = req.user;
    const result = await UserService.getUserStats(user);
    sendResponse(res, {
      statusCode: StatusCodes.OK,
      success: true,
      message: "User Stats retrieved Successfully!",
      data: result,
    });
  }
);

const getStatsBasedOnRole = catchAsync(
  async (req: Request & { user?: TAuthUser }, res: Response) => {
    const user = req.user;

    if (!user) {
      throw new AppError(StatusCodes.UNAUTHORIZED, "Unauthorized access");
    }

    let result;

    if (user.role === UserRole.ADMIN || user.role === UserRole.SUPER_ADMIN) {
      result = await AdminService.getAdminStats(user);
    } else if (user.role === UserRole.USER) {
      result = await UserService.getUserStats(user);
    } else {
      throw new AppError(StatusCodes.FORBIDDEN, "Access denied for this role");
    }

    sendResponse(res, {
      statusCode: StatusCodes.OK,
      success: true,
      message: "Stats retrieved successfully!",
      data: result,
    });
  }
);

const getChartData = catchAsync(
  async (req: Request & { user?: TAuthUser }, res: Response) => {
    const user = req.user;
    const result = await DashboardService.getChartData(user);
    sendResponse(res, {
      statusCode: StatusCodes.OK,
      success: true,
      message: "Bar Chart retrieved Successfully!",
      data: result,
    });
  }
);

export const DashboardController = {
  getStatsBasedOnRole,
  getAdminStats, // Optional
  getUserStats, // Optional
  getChartData,
};
