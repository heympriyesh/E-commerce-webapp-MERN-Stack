import express from "express";
import { isLoggedIn } from "../middlewares/isLoggedIn.js";
import { createCouponCtrl, deleteSingleCoupon, getAllCoupnsCtrl, getSingleCouponCtrl, updateCouponCtrl } from "../controllers/couponsCtrl.js";
import isAdmin from "../middlewares/isAdmin.js";

const couponRouter = express.Router();

couponRouter.get("/", isLoggedIn, getAllCoupnsCtrl);
couponRouter.post("/", isLoggedIn,isAdmin, createCouponCtrl);
couponRouter.get('/:id',getSingleCouponCtrl);
couponRouter.put('/update/:id',isLoggedIn,isAdmin,updateCouponCtrl)
couponRouter.delete('/delete/:id',isLoggedIn,isAdmin,deleteSingleCoupon);

export default couponRouter;
