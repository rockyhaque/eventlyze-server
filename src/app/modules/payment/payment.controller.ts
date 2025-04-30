import { StatusCodes } from "http-status-codes";
import catchAsync from "../../../shared/catchAsync";
import sendResponse from "../../../shared/sendResponse";
import { PaymentService } from "./payment.service";



const createpayment = catchAsync(async (req, res) => {
    const result = await PaymentService.createpaymentBd()  ;
    
    sendResponse(res, {
      statusCode: StatusCodes.OK,
      success: true,
      message: "Logged in Successfull",
      data: {},
    });
  });
const successfullypaid = catchAsync(async (req, res) => {
    const result = await PaymentService.createpaymentBd()  ;
    
    sendResponse(res, {
      statusCode: StatusCodes.OK,
      success: true,
      message: "Logged in Successfull",
      data: {},
    });
  });
const paymentFails = catchAsync(async (req, res) => {
    const result = await PaymentService.createpaymentBd()  ;
    
    sendResponse(res, {
      statusCode: StatusCodes.OK,
      success: true,
      message: "Logged in Successfull",
      data: {},
    });
  });
const paymentId = catchAsync(async (req, res) => {
    const result = await PaymentService.createpaymentBd()  ;
    
    sendResponse(res, {
      statusCode: StatusCodes.OK,
      success: true,
      message: "Logged in Successfull",
      data: {},
    });
  });

  export const  PaymentController = {
    createpayment
  } 
  