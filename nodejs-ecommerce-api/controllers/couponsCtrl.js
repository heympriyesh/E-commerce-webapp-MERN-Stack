import expressAsyncHandler from "express-async-handler";
import Coupon from "../model/Coupon.js";

/**
 * @desc Create new Coupon
 * @route POST /api/v1/coupons
 * @access Private/Admin
 */

export const createCouponCtrl = expressAsyncHandler(async (req, res) => {
  const { code, startDate, endDate, discount } = req.body;

  const couponsExists = await Coupon.findOne({ code });

  if (couponsExists) throw new Error("Coupon already exists");

  if (isNaN(discount)) throw new Error("Discount value must be a number");

  const coupon = await Coupon.create({
    code: code?.toUpperCase(),
    startDate,
    endDate,
    discount,
    user: req.userAuthId,
  });

  res.status(201).json({
    status: "success",
    message: "Coupon created successfully",
    coupon,
  });
});

/**
 * @desc Get all Coupons
 * @route GET /api/v1/coupons
 * @access Private/Admin
 */
export const getAllCoupnsCtrl = expressAsyncHandler(async (req, res) => {
  const coupons = await Coupon.find({});
  res.json({
    status: "suceess",
    message: "All coupons",
    coupons,
  });
});

export const getSingleCouponCtrl = expressAsyncHandler(async (req, res) => {
  const coupon = await Coupon.findById(req.params.id);
  res.json({
    status: "suceess",
    message: "Coupon fetched",
    coupon,
  });
});

export const updateCouponCtrl = expressAsyncHandler(async (req, res) => {
  const { code, startDate, endDate, discount } = req.body;

  const coupon = await Coupon.findByIdAndUpdate(
    req.params.id,
    {
      code: code?.toUpperCase(),
      startDate,
      endDate,
      discount,
    },
    {
      new: true,
    }
  );
  res.json({
    status: "suceess",
    message: "Coupon fetched",
    coupon,
  });
});

export const deleteSingleCoupon = expressAsyncHandler(async (req, res) => {
    await Coupon.findByIdAndDelete(req.params.id);
    res.json({
      status: "suceess",
      message: "Coupon Deleted successfully",
    });
  });