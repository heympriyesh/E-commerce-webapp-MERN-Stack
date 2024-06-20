import expressAsyncHandler from "express-async-handler";
import Stripe from "stripe";
import dotenv from "dotenv";
dotenv.config();
import Order from "../model/Order.js";
import User from "../model/User.js";
import Product from "../model/Product.js";
import Coupon from "../model/Coupon.js";

// Stripe instance
const stripe = new Stripe(process.env.STRIPE_KEY);

/**
 * @desc create orders
 * @route POST /api/v1/orders
 * @access private
 */

export const createOrderCtrl = expressAsyncHandler(async (req, res) => {
  // get the coupon
   const {coupon}=req?.query;

    const couponFound=await Coupon.findOne({code:coupon?.toUpperCase()})
    if(couponFound?.isExpired){
      throw new Error('Coupon has expired')
    }
    if(!couponFound)
      throw new Error('Coupon doesnot exists');


  // get discout
  const discount=couponFound?.discount / 100 ;

  // Get the payload(customer,orderItems,shippingAddress,totalPrice)
  const { orderItems, shippingAddress, totalPrice } = req.body;

  //   Find the user
  const user = await User.findById(req.userAuthId);

  if (!user?.hasShippingAddress)
    throw new Error("Please provide shipping address");
  // Check if order is not empty
  if (orderItems?.length <= 0) {
    throw new Error("No Order Items");
  }
  // Place/create order -save into DB
  const order = await Order.create({
    user: user?._id,
    orderItems,
    shippingAddress,
    totalPrice : couponFound ? totalPrice- totalPrice * discount:totalPrice
  });
  //   push order into user
  user.orders.push(order._id);
  await user.save();
  // Update the product qty
  const products = await Product.find({ _id: { $in: orderItems } });
  orderItems?.map(async (order) => {
    const product = products.find((product) => {
      return product?._id?.toString() === order?._id?.toString();
    });
    if (product) product.totalSold += order.qty;

    await product.save();
  });
  user.orders.push(order?._id);
  await user.save();
  const convertedOrders=orderItems.map((item)=>{
    return {
        price_data:{
            currency:'inr',
            product_data:{
                name:item?.name,
                description:item?.description
            },
            unit_amount:item?.price * 100,
        },
        quantity:item?.qty
    }
  })
  // make payment (stripe)
  const session = await stripe.checkout.sessions.create({
    line_items: convertedOrders,
    metadata:{
        orderId:JSON.stringify(order?._id)
    },
    mode: "payment",
    success_url: "http://localhost:3000/success",
    cancel_url: "http://localhost:3000/cancel",
  });
  res.send({ url: session.url });
 
});


/**
 * @desc get all orders
 * @route GET /api/v1/orders
 * @access Private
 */
export const getAllOrderCtrl=expressAsyncHandler(async (req,res)=>{
    // find all orders
    const orders=await Order.find();
    res.send({
        success:true,
        message:"All orders",
        orders
    })
})

/**
 * @desc get single order
 * @route GET /api/v1/orders/:id
 * @access Private/admin
 */
export const getSingleOrder=expressAsyncHandler(async (req,res)=>{
    // find all orders
    const id=req.params.id;
    const order=await Order.findById(id);
    res.send({
        success:true,
        message:"All orders",
        order
    })
})

/**
 * @desc update order to delivered
 * @route PUT /api/v1/orders/update/:id
 * @access Priavate/Admin
 */

export const updateOrderCtrl=expressAsyncHandler(async (req,res)=>{
    const id=req.params.id;

    const updateOrder=await Order.findByIdAndUpdate( 
        id,
        {
            stauts:req.body.stauts
        },
        {
            new:true
        }
    )
    res.status(200).json({
        success:true,
        message:"Order delivered",
        updateOrder
    })
})

/**
 * @desc get sales sum of orders
 * @route GET /api/v1/orders/sales/sum
 * @access Private/Admin
 */

export const getSalesSumCtrl=expressAsyncHandler(async (req,res)=>{
  
 
  const orders=await Order.aggregate([
    {
      "$group":{
        _id:null,
        minimumSales:{
          $min:"$totalPrice"
        },
        maxSales:{
          $max:"$totalPrice"
        },
        avgSales:{
          $avg:"$totalPrice"
        },
        totalSales:{
          $sum:"$totalPrice"
        }
      }
    }
  ]);

  const date=new Date();
  const today=new Date(date.getFullYear(),date.getMonth(),date.getDate());

  const salesToday=await Order.aggregate([
    {
      $match:{
        createdAt:{
          $gte:today
        }
      }
    },
    {
      $group:{
        _id:null,
        totalSales:{
          $sum:"$totalPrice"
        }
      }
    }
  ])
  res.json({
    
    orders,
    salesToday
  })
})