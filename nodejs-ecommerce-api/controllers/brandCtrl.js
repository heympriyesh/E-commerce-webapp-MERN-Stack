import expressAsyncHandler from "express-async-handler";
import Brand from "../model/Brand.js";

/**
 * @desc Create new Brand
 * @route POST /api/v1/brand
 * @access Private/Admin
 */

export const createBrandCtrl = expressAsyncHandler(async (req, res) => {
  const { name } = req.body;

  // Brand exists
  const brandFound = await Brand.findOne({ name:name.toLowerCase() });
  if (brandFound) throw new Error("Brand already exits");

  // create
  const brand = await Brand.create({
    name:name.toLowerCase(),
    user: req.userAuthId,
  });

  res.json({
    status: "success",
    message: "Brand created successfully",
    brand,
  });
});

/**
 * @desc Get all brand
 * @route GET /api/v1/brand
 * @access Public
 */

export const getAllBrandCtrl = expressAsyncHandler(async (req, res) => {
  const brand = await Brand.find({});

  res.json({
    status: "success",
    message: "Brand fetched successfully",
    brand,
  });
});

/**
 * @desc Get single brand
 * @route GET /api/v1/brand/:id
 * @access Public
 */

export const getSingleBrandCtrl = expressAsyncHandler(async (req, res) => {
  const brand = await Brand.findById(req.params.id);

  res.json({
    status: "success",
    message: "Brand fetched successfully",
    brand,
  });
});

/**
 * @desc Update Brand
 * @route GET /api/v1/brand/:id
 * @access Public
 */

export const updateBrandCtrl = expressAsyncHandler(async (req, res) => {
  const { name } = req.body;
  const brand = await Brand.findByIdAndUpdate(
    req.params.id,
    {
      name:name.toLowerCase(),
    },
    {
      new: true,
    }
  );

  if(!brand)
    throw new Error('Brand not found')
  res.json({
    status: "success",
    messag: "Brand updated successfully",
    brand,
  });
});


/**
 * @desc delete brands
 * @route DELETE /api/brands/:id/delete
 * @access Private/Admin
 */
export const deleteBrandCtrl = expressAsyncHandler(async (req, res) => {
    const id = req.params.id;
   await Brand.findByIdAndDelete(id);
    return res.json({
      stauts: "success",
      message: "Brand deleted successfully",
    });
  });