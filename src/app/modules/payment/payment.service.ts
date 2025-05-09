import uuid4 from "uuid4";
import SSLCommerzPayment from "sslcommerz-lts";
import config from "../../../config";
import prisma from "../../../shared/prisma";
import { Event, PaymentStatus } from "@prisma/client";
import { TAuthUser } from "../../interfaces/common";
import AppError from "../../errors/AppError";
import { StatusCodes } from "http-status-codes";
type Tpaymentpayload = {
  price: number;
  eventId: string;
  username: string;
  email: string;
  userId: string;
};

const store_id = config.SSLcommer_store_id;
const store_passwd = config.SSLcommer_password;
const is_live = false;

const createpaymentBd = async (payload: Tpaymentpayload, user: TAuthUser) => {
  const userData = await prisma.user.findUnique({
    where: {
      email: user?.email,
    },
  });

  if (!userData) {
    throw new AppError(StatusCodes.NOT_FOUND, "User not found");
  }

  const eventData = await prisma.event.findUnique({
    where: {
      id: payload.eventId,
    },
  });

  if (!eventData) {
    throw new AppError(StatusCodes.NOT_FOUND, "Event not found");
  }




  const id = uuid4();
  const data = {
    total_amount: eventData?.price,
    currency: "BDT",
    tran_id: id,
    success_url: `${config.CLIENT_URL}/payments/success/${id}`,
    fail_url: `${config.CLIENT_URL}/payments/failed/${id}`,
    cancel_url: `${config.CLIENT_URL}/payments/cancel/${id}`,
    ipn_url: "http://localhost:3030/ipn",
    shipping_method: "Courier",
    product_name: payload.eventId,
    product_category: "Electronic",
    product_profile: "general",
    cus_name: userData.name,
    cus_email: userData.email,
    cus_add1: "Dhaka",
    cus_add2: "Dhaka",
    cus_city: "Dhaka",
    cus_state: "Dhaka",
    cus_postcode: "1000",
    cus_country: "Bangladesh",
    cus_phone: "01711111111",
    cus_fax: "01711111111",
    ship_name: "Customer Name",
    ship_add1: "Dhaka",
    ship_add2: "Dhaka",
    ship_city: "Dhaka",
    ship_state: "Dhaka",
    ship_postcode: 1000,
    ship_country: "Bangladesh",
  };
  console.log(data);

  const sslcz = new SSLCommerzPayment(
    store_id as string,
    store_passwd as string,
    is_live
  );

  const apiResponse = await sslcz.init(data);
  // console.log('API Response:', apiResponse);
  const GatewayPageURL = apiResponse.GatewayPageURL;
  //  console.log(GatewayPageURL);
  const newpayment = await prisma.payment.create({
    data: {
      paymentId: id,
      eventId: payload.eventId,
      userId: userData.id,
      amount: eventData.price,
      paymentUrl: GatewayPageURL,
    },
  });

  return newpayment;
};





const validatePayment = async (payload: any, user: TAuthUser) => {
  // console.log("Payload:", payload, "User:", user);
  // ✅ You can optionally keep this if you want to validate payment status before proceeding
  // if (!payload || payload.status !== 'VALID') {
  //   return { message: "Invalid payment!" };
  // }
  const paymentId = payload.tran_id;
  const excistingPayment = await prisma.payment.findUnique({
    where: {
      paymentId: paymentId,
    },
  });

  if (!excistingPayment) {
    throw new AppError(StatusCodes.NOT_FOUND, "Payment not found");
  }
  const userData = await prisma.user.findUnique({
    where: {
      email: user?.email,
    },
  });

  if (!userData) {
    throw new AppError(StatusCodes.NOT_FOUND, "User not found");
  }
  // // ✅ simulate validation for demo, replace this with actual logic if needed
  const response = payload;


  const updatedPayment = await prisma.payment.update({
    where: {
      paymentId: response.tran_id, // ✅ changed: transactionId → paymentId for consistency
    },
    data: {
      status: PaymentStatus.COMPLETED,
    },
  });

  console.log("Updated Payment:", updatedPayment);


  // await prisma.$transaction(async (tx) => {
  //   const updatedPayment = await tx.payment.update({
  //     where: {
  //       paymentId: response.tran_id, // ✅ changed: transactionId → paymentId for consistency
  //     },
  //     data: {
  //       status: PaymentStatus.COMPLETED,
  //       // paymentGatewayData: response,
  //     },
  //   });

  //   await tx.event.update({
  //     where: {
  //       id: updatedPayment.eventId, // ✅ changed: appointment → event
  //     },
  //     data: {
  //       paymentStatus: PaymentStatus.COMPLETED,
  //     },
  //   });
  // });

  // return {
  //   message: "Payment success!",
  // };
  return updatedPayment;
};









const succfulpayment = async (tranId: string) => {
  const result = await prisma.payment.update({
    where: {
      paymentId: tranId,
    },
    data: {
      status: PaymentStatus.SUCCESS,
    },
  });

  if (result.status === PaymentStatus.SUCCESS) {
    return "http://localhost:3000/";
  }
};

const failpayment = async (tranId: string) => {
  const result = await prisma.payment.update({
    where: {
      paymentId: tranId,
    },
    data: {
      status: PaymentStatus.FAILED,
    },
  });

  if (result.status === PaymentStatus.FAILED) {
    return "http://localhost:3000/";
  }
};

const canclepayment = async (tranId: string) => {
  const result = await prisma.payment.update({
    where: {
      paymentId: tranId,
    },
    data: {
      status: PaymentStatus.CANCELLED,
    },
  });

  if (result.status === PaymentStatus.CANCELLED) {
    return "http://localhost:3000/";
  }
};

const getSinglePayment = async (userId: string, eventId: string) => {
  const result = await prisma.payment.findFirst({
    where: {
      userId: userId,
      eventId: eventId,
    },
  });
  return result;
};

export const PaymentService = {
  createpaymentBd,
  succfulpayment,
  failpayment,
  canclepayment,
  getSinglePayment,
  validatePayment
};



