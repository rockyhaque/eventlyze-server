/* eslint-disable no-unused-vars */
declare module 'sslcommerz-lts' {
    export interface InitApiResponse {
      status: string;
      failedreason: string;
      sessionkey: string;
      GatewayPageURL: string;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      [key: string]: any;
    }
  
    export default class SSLCommerzPayment {
      constructor(storeId: string, storePassword: string, isLive: boolean);
      init(data: object): Promise<InitApiResponse>;
      validate(
        orderId: string,
        amount: number,
        currency: string,
      ): Promise<object>;
      transactionQuery(orderId: string): Promise<object>;
    }
  }
  