// import uuid4 from "uuid4";

const createpaymentBd = () => {
     const uuid = use 
}

export const PaymentService = {
    createpaymentBd
}



// app.post('/order', async (req: Request, res: Response) => {
//     const value = req.body;
//     const unId = 'REF' + value.price;
//     const data = {
//       total_amount: value.price,
//       currency: 'BDT',
//       tran_id: unId,
//       success_url: `http://localhost:5000/payment/success/${unId}`,
//       fail_url: 'http://localhost:3030/fail',
//       cancel_url: 'http://localhost:3030/cancel',
//       ipn_url: 'http://localhost:3030/ipn',
//       shipping_method: 'Courier',
//       product_name: value.productId,
//       product_category: 'Electronic',
//       product_profile: 'general',
//       cus_name: value.name,
//       cus_email: value.email,
//       cus_add1: 'Dhaka',
//       cus_add2: 'Dhaka',
//       cus_city: 'Dhaka',
//       cus_state: 'Dhaka',
//       cus_postcode: '1000',
//       cus_country: 'Bangladesh',
//       cus_phone: '01711111111',
//       cus_fax: '01711111111',
//       ship_name: 'Customer Name',
//       ship_add1: 'Dhaka',
//       ship_add2: 'Dhaka',
//       ship_city: 'Dhaka',
//       ship_state: 'Dhaka',
//       ship_postcode: 1000,
//       ship_country: 'Bangladesh',
//     };
//     const sslcz = new SSLCommerzPayment(
//       store_id as string,
//       store_passwd as string,
//       is_live,
//     );
//     sslcz.init(data).then(async (apiResponse) => {
//       // Redirect the user to payment gateway
//       const GatewayPageURL = apiResponse.GatewayPageURL;
//       res.send({ url: GatewayPageURL });
  
//       const finalorder = {
//         ...value,
//         paidStatus: false,
//         tranId: unId,
//       };
  
//       const reuslt = await Order.create(finalorder);
//       console.log(reuslt);
//     });
//   });


//   app.post('/payment/success/:tranId', async (req, res) => {
//     console.log(req.params.tranId);
//     const reuslt = await Order.findOneAndUpdate(
//       { tranId: req.params.tranId },
//       {
//         tranId: true,
//       },
//       {
//         new: true,
//       },
//     );
//     if (reuslt?.tranId) {
//       res.redirect('http://localhost:5173/');
//     }
//   });
  