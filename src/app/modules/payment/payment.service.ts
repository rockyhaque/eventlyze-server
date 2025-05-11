import uuid4 from "uuid4";
import SSLCommerzPayment from "sslcommerz-lts";
import config from "../../../config";
import prisma from "../../../shared/prisma";
import {
  Event,
  ParticipantStatus,
  PaymentStatus,
  UserRole,
} from "@prisma/client";
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

const getAllPayments = async (user: TAuthUser) => {
  const userData = await prisma.user.findUnique({
    where: {
      email: user?.email,
    },
  });

  if (!userData) {
    throw new AppError(StatusCodes.NOT_FOUND, "User not found");
  }

  let payments;

  if (
    userData.role === UserRole.ADMIN ||
    userData.role === UserRole.SUPER_ADMIN
  ) {
    // Admins see all payments
    payments = await prisma.payment.findMany({
      include: {
        event: {
          select: {
            id: true,
            title: true,
          },
        },
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            photo: true,
          },
        },
      },
    });
  } else if (userData.role === UserRole.USER) {
    // Regular users see only their own payments
    payments = await prisma.payment.findMany({
      where: {
        userId: userData.id,
      },
      include: {
        event: {
          select: {
            id: true,
            title: true,
          },
        },
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            photo: true,
          },
        },
      },
    });
  } else {
    throw new AppError(StatusCodes.FORBIDDEN, "Unauthorized access");
  }

  if (!payments || payments.length === 0) {
    throw new AppError(StatusCodes.NOT_FOUND, "No payment found");
  }

  return payments;
};

const createPayment = async (payload: Tpaymentpayload, user: TAuthUser) => {
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
    success_url: `${config.BACKEND_URL}/payments/success/${id}`,
    fail_url: `${config.BACKEND_URL}/payments/failed/${id}`,
    cancel_url: `${config.BACKEND_URL}/payments/cancel/${id}`,
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

  const response = payload;

  const result = await prisma.$transaction(async (tx) => {
    const updatedPayment = await tx.payment.update({
      where: {
        paymentId: response.tran_id, // transactionId → paymentId for consistency
      },
      data: {
        status: PaymentStatus.COMPLETED,
      },
    });

    await prisma.participant.create({
      data: {
        eventId: updatedPayment.eventId,
        userId: userData.id,
        status: ParticipantStatus.REQUESTED,
      },
    });
    return updatedPayment;
  });

  return result;
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

const paymentSuccess = async (tranId: string) => {
  const result = await prisma.$transaction(async (tx) => {
    const paymentStateChange = await tx.payment.update({
      where: {
        paymentId: tranId,
      },
      data: {
        status: PaymentStatus.SUCCESS,
      },
    });

    await prisma.participant.create({
      data: {
        eventId: paymentStateChange?.eventId,
        userId: paymentStateChange?.userId!,
        status: ParticipantStatus.REQUESTED,
      },
    });
    return paymentStateChange;
  });



  if (result.status === PaymentStatus.SUCCESS) {
    return `${config.CLIENT_URL}/payments/success`;
  }
};

const paymentFailed = async (tranId: string) => {
  const result = await prisma.payment.update({
    where: {
      paymentId: tranId,
    },
    data: {
      status: PaymentStatus.FAILED,
    },
  });

  if (result.status === PaymentStatus.FAILED) {
    return `${config.CLIENT_URL}/payments/failed`;
  }
};

const paymentCancel = async (tranId: string) => {
  const result = await prisma.payment.update({
    where: {
      paymentId: tranId,
    },
    data: {
      status: PaymentStatus.CANCELLED,
    },
  });

  if (result.status === PaymentStatus.CANCELLED) {
    return `${config.CLIENT_URL}/payments/failed`;
  }
};

export const PaymentService = {
  getAllPayments,
  createPayment,
  getSinglePayment,
  validatePayment,
  paymentSuccess,
  paymentFailed,
  paymentCancel,
};
