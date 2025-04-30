import { StatusCodes } from "http-status-codes";
import catchAsync from "../../../shared/catchAsync";
import sendResponse from "../../../shared/sendResponse";
import { AuthService } from "./auth.service";

const loginUser = catchAsync(async (req, res) => {
  const result = await AuthService.loginUser(req.body);
  const { refreshToken } = result;
  res.cookie("refreshToken", refreshToken, {
    secure: false,
    httpOnly: true,
  });
  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: "Logged in Successfull",
    data: {
      accessToken: result.accessToken,
      needPasswordChange: result.needPasswordChange,
    },
  });
});

const refreshToken = catchAsync(async (req, res) => {
    const { refreshToken } = req.cookies;
    const result = await AuthService.refreshToken(refreshToken);
  
    sendResponse(res, {
      statusCode: StatusCodes.OK,
      success: true,
      message: "Access Token Generated Successfully!",
      data: result,
    });
  });


export const AuthController = {
  loginUser,
  refreshToken

};