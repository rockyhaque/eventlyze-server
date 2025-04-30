import { StatusCodes } from "http-status-codes";
import catchAsync from "../../../shared/catchAsync";
import { UserService } from "./user.service";
import sendResponse from "../../../shared/sendResponse";

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




export const UserController = {
    createUser,
    createAdmin
}