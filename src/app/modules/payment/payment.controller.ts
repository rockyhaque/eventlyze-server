import { StatusCodes } from "http-status-codes";
import catchAsync from "../../../shared/catchAsync";
import sendResponse from "../../../shared/sendResponse";
import { PaymentService } from "./payment.service";
import { Request, Response } from "express";
import { TAuthUser } from "../../interfaces/common";


interface CustomRequest extends Request {
  user?: any;
}

const createPayment = catchAsync(async (req: Request & { user?: TAuthUser }, res: Response) => {
  const result = await PaymentService.createpaymentBd(req.body, req.user as TAuthUser);
  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: "succesfully get payment",
    data: result,
  });
});


const validatePayment = catchAsync(async (req: CustomRequest, res: Response) => {
  const users = req.user as TAuthUser;
  const result = await PaymentService.validatePayment(req.query, users);
  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: 'Payment validate successfully',
    data: result,
  });
});



const getpayment = catchAsync(async (req: Request, res: Response) => {
  const { userId, eventId } = req.params;
  const result = await PaymentService.getSinglePayment(userId, eventId);
  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: "succesfully get payment",
    data: result,
  });
});

export const PaymentController = {
  getpayment,
  createPayment,
  validatePayment,
};
