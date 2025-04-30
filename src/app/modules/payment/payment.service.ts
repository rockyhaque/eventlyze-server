import uuid4 from "uuid4";
import SSLCommerzPayment from 'sslcommerz-lts';
import config from "../../../config";
import prisma from "../../../shared/prisma";
import { PaymentStatus } from "@prisma/client";
type Tpaymentpayload = {
    price: number;
    eventId: string;
    username: string;
    email: string;
    userId:string;

}

const store_id = config.SSLcommer_store_id;
const store_passwd = config.SSLcommer_password;
const is_live = false;

const createpaymentBd = async (payload:Tpaymentpayload) => {
    const id = uuid4();
    const data = {
      total_amount: payload.price,
      currency: 'BDT',
      tran_id: id,
      success_url: `${config.BACKEND_URL}/payments/success/${id}`,
      fail_url: `${config.BACKEND_URL}/payments/faild/${id}`,
      cancel_url: `${config.BACKEND_URL}/payments/cancle/${id}`,
      ipn_url: 'http://localhost:3030/ipn',
      shipping_method: 'Courier',
      product_name: payload.eventId,
      product_category: 'Electronic',         
      product_profile: 'general',            
      cus_name: payload.username,
      cus_email: payload.email,
      cus_add1: 'Dhaka',
      cus_add2: 'Dhaka',
      cus_city: 'Dhaka',
      cus_state: 'Dhaka',
      cus_postcode: '1000',
      cus_country: 'Bangladesh',
      cus_phone: '01711111111',
      cus_fax: '01711111111',
      ship_name: 'Customer Name',
      ship_add1: 'Dhaka',
      ship_add2: 'Dhaka',
      ship_city: 'Dhaka',
      ship_state: 'Dhaka',
      ship_postcode: 1000,
      ship_country: 'Bangladesh',
    };
    
  
    const sslcz = new SSLCommerzPayment(
      store_id as string,
      store_passwd as string,
      is_live,
    );
  
    const apiResponse = await sslcz.init(data);
    console.log('API Response:', apiResponse);
    const GatewayPageURL = apiResponse.GatewayPageURL;
   console.log(GatewayPageURL);
    const newpayment = await prisma.payment.create({
      data: {
        paymentId: id,
        eventId: payload.eventId,
        userId: payload.userId,
        amount: payload.price,
        paymentUrl: GatewayPageURL,
      },
    });
  
    return newpayment;
  };

const succfulpayment = async (tranId:string) => {
    const result = await prisma.payment.update({
        where: {
          paymentId: tranId,
        },
        data: {
          status: PaymentStatus.SUCCESS
        },
     })

     if(result.status === PaymentStatus.SUCCESS){
        return "http://localhost:3000/"
     }
}
  
const failpayment = async (tranId:string) => {
    const result = await prisma.payment.update({
        where: {
          paymentId: tranId,
        },
        data: {
          status: PaymentStatus.FAILED
        },
     })

     if(result.status === PaymentStatus.FAILED){
        return "http://localhost:3000/"
     }
}
  
const canclepayment = async (tranId:string) => {
    const result = await prisma.payment.update({
        where: {
          paymentId: tranId,
        },
        data: {
          status: PaymentStatus.CANCELLED
        },
     })

     if(result.status === PaymentStatus.CANCELLED){
        return "http://localhost:3000/"
     }
}

const getSinglePayment = async (userId:string,eventId:string) => {
    const result = await prisma.payment.findFirst({
        where: {
          userId: userId,
          eventId: eventId,
        },
    })
    return result;
}
  


export const PaymentService = {
    createpaymentBd,
    succfulpayment,
    failpayment,
    canclepayment,
    getSinglePayment,
}







