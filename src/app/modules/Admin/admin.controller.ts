import { StatusCodes } from "http-status-codes";
import catchAsync from "../../../shared/catchAsync";
import sendResponse from "../../../shared/sendResponse";
import { AdminService } from "./admin.service";


const permanentDeleteUser = catchAsync(async (req, res) => {
    const { id } = req.params;
  
    const result = await AdminService.permanentDeleteUser(id);
    sendResponse(res, {
      statusCode: StatusCodes.OK,
      success: true,
      message: "User deleted Successfully!",
      data: result,
    });
  });

const softUserDelete = catchAsync(async (req, res) => {
    const { id } = req.params;
  
    const result = await AdminService.softUserDelete(id);
    sendResponse(res, {
      statusCode: StatusCodes.OK,
      success: true,
      message: "User deleted Successfully!",
      data: result,
    });
  });
  
  export const AdminController = {
    softUserDelete,
    permanentDeleteUser
  };