import { StatusCodes } from "http-status-codes";
import catchAsync from "../../../shared/catchAsync";
import sendResponse from "../../../shared/sendResponse";
import { PaymentService } from "./payment.service";
import { Request, Response } from "express";


// const createPayment = catchAsync(async (req:Request, res:Response) => {
    
//     const result = await PaymentService.createpaymentBd(req.body)  ;
//     sendResponse(res, {
//         statusCode: StatusCodes.OK,
//         success: true,
//         message: "succesfully get payment",
//         data:result,
//       });
    
//   });


const successfullypaid = catchAsync(async (req:Request, res:Response) => {
    const {id} = req.params;
    const result = await PaymentService.succfulpayment(id)  ;
    res.redirect(301, result as string);
    
  });


const paymentFails = catchAsync(async (req:Request, res:Response) => {
    const {id} = req.params;
    const result = await PaymentService.failpayment(id)  ;
    res.redirect(301, result as string);
  });


const paymentcancle = catchAsync(async (req:Request, res:Response) => {
    const {id} = req.params;
    const result = await PaymentService.canclepayment(id)  ;
    res.redirect(301, result as string);
  });


const getpayment = catchAsync(async (req:Request, res:Response) => {
    const {userId,eventId} = req.params;
    const result = await PaymentService.getSinglePayment(userId,eventId)  ;
    sendResponse(res, {
        statusCode: StatusCodes.OK,
        success: true,
        message: "succesfully get payment",
        data:result,
      });
    
  });

  export const  PaymentController = {
    successfullypaid,
    paymentFails,
    paymentcancle,
    getpayment,
    // createPayment,
    
  } 
  