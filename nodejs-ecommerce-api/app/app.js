import dotenv from 'dotenv';
dotenv.config()
import express from 'express';
import Stripe from "stripe";

import dbConnect from '../config/dbConnect.js';
import userRoutes from '../routes/userRoute.js';
import { globalErrHandler, notFound } from '../middlewares/globalErrHandler.js';
import productRouter from '../routes/productRoute.js';
import categoriesRouter from '../routes/categoriesRoute.js';
import brandRouter from '../routes/brandRoute.js';
import colorRouter from '../routes/colorRoute.js';
import reviewRouter from '../routes/reviewRoute.js';
import ordersRouter from '../routes/ordersRouter.js';
import Order from '../model/Order.js';
import couponRouter from '../routes/couponsRoute.js';

dbConnect();

const app=express();


// Stripe Webhook

const stripe = new Stripe(process.env.STRIPE_KEY);

// This is your Stripe CLI webhook secret for testing your endpoint locally.
const endpointSecret = "whsec_aede0d8c9de63ee2504d49e29ec266bac9308016ac680618919511a24ebc0ced";

app.post('/webhook', express.raw({type: 'application/json'}),async (request, response) => {
  const sig = request.headers['stripe-signature'];

  let event;

  try {
    event = stripe.webhooks.constructEvent(request.body, sig, endpointSecret);
  } catch (err) {
    response.status(400).send(`Webhook Error: ${err.message}`);
    return;
  }

    if(event.type === 'checkout.session.completed'){
        const session=event.data.object;
        const {orderId}=session.metadata;
        const paymentStatus=session.payment_status;
        const paymentMethod=session.payment_method_types[0];
        const totalAmount=session.amount_total;
        const currency=session.currency;
        const order=await Order.findByIdAndUpdate(
            JSON.parse(orderId),
            {
                totalPrice:totalAmount/100,
                currency,
                paymentMethod,
                paymentStatus
            },
            {
                new:true
            }
        );        
    }

  response.send();
});

// pass incoming data
app.use(express.json())

// routes
app.use('/api/v1/users/',userRoutes);
app.use('/api/v1/products/',productRouter);
app.use('/api/v1/categories/',categoriesRouter);
app.use('/api/v1/brands/',brandRouter);
app.use('/api/v1/colors/',colorRouter);
app.use('/api/v1/reviews/',reviewRouter);
app.use('/api/v1/orders/',ordersRouter);
app.use('/api/v1/coupons/',couponRouter);


// err middleware
app.use(notFound)
app.use(globalErrHandler);
export default app;