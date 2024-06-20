import User from "../model/User.js";
import expressAsyncHandler from "express-async-handler";
import bcrypt from "bcryptjs";
import generateToken from "../utils/generateToken.js";
import { getTokenFromHeader } from "../utils/getTokenFromHeaders.js";
import { verifyToken } from "../utils/verifyToken.js";

/**
 * @desc Register user
 * @route POST /api/v1/users/register
 * @access Private/Admin
 */
export const registerUserCtrl = expressAsyncHandler(async (req, res) => {
  // try {
  const { fullname, email, password } = req.body;

  const userExists = await User.findOne({ email });
  if (userExists) {
    throw new Error("User already exists");
    //   return res.json({
    //     msg: "User already exists",
    //   });
  }
  // hash password
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  const user = await User.create({
    fullname,
    email,
    password: hashedPassword,
  });
  res.status(201).json({
    status: "Success",
    message: "User Registered Successfully",
    data: user,
  });
 
});

/**
 * @desc Login user
 * @route POST /api/v1/users/login
 * @access Public
 */

export const loginUserCtrl = expressAsyncHandler(async (req, res) => {
  //   try {
  const { email, password } = req.body;

  const userFound = await User.findOne({ email });

  if (!userFound) {
    res.json({
      message: "Invalid login details",
    });
  }
  if (userFound && (await bcrypt.compare(password, userFound?.password))) {
    return res.json({
      status: "success",
      message: "User logged in successfully",
      userFound,
      token: generateToken(userFound?._id),
    });
  } else {
    console.log("else block");
    throw new Error("Invalid login credentials.");
  }
});

/**
 * @desc Get user profile
 * @route GET /api/v1/users/profile
 * @access Private
 */
export const getUserProfile = expressAsyncHandler(async (req, res) => {

  const user=await User.findById(req.userAuthId).populate('orders');

  res.json({
   status:"success",
   message:"User profile fetched successfully",
   user
  });
});

/**
 * @desc Update user shipping address
 * @route PUT /api/v1/users/update/shipping
 * @access Private
 */

export const updateShippingAddressCtrl=expressAsyncHandler(async (req,res)=>{
  const {firstName,lastName,address,city,postalCode,province,phone}=req.body;
  const user=await User.findByIdAndUpdate(req.userAuthId,{
    shippingAddress:{
      firstName,
      lastName,
      address,
      city,
      postalCode,
      province,
      phone
    },
    hasShippingAddress:true
  },{
    new:true
  })
  
  res.json({
    status:"success",
    message:"User shipping address update successfully",
    user
  })
})