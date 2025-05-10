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
  const result = await PaymentService.createPayment(req.body, req.user as TAuthUser);
  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: "successfully get payment",
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

const getPayment = catchAsync(async (req: Request, res: Response) => {
  const { userId, eventId } = req.params;
  const result = await PaymentService.getSinglePayment(userId, eventId);
  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: "successfully get payment",
    data: result,
  });
});

const paymentSuccess = catchAsync(async (req:Request, res:Response) => {
  const {id} = req.params;
  const result = await PaymentService.paymentSuccess(id)  ;
  res.redirect(301, result as string);
});

const paymentFailed = catchAsync(async (req:Request, res:Response) => {
  const {id} = req.params;
  const result = await PaymentService.paymentFailed(id)  ;
  res.redirect(301, result as string);
});


const paymentCancel = catchAsync(async (req:Request, res:Response) => {
  const {id} = req.params;
  const result = await PaymentService.paymentCancel(id)  ;
  res.redirect(301, result as string);
});

export const PaymentController = {
  getPayment,
  createPayment,
  validatePayment,
  paymentSuccess,
  paymentFailed,
  paymentCancel
};
