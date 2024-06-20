import expressAsyncHandler from "express-async-handler";
import Color from "../model/Color.js";

/**
 * @desc Create new Color
 * @route POST /api/v1/color
 * @access Private/Admin
 */

export const createColorCtrl = expressAsyncHandler(async (req, res) => {
  const { name } = req.body;

  // Color exists
  const colorFound = await Color.findOne({ name:name.toLowerCase() });
  if (colorFound) throw new Error("Color already exits");

  // create
  const color = await Color.create({
    name:name.toLowerCase(),
    user: req.userAuthId,
  });

  res.json({
    status: "success",
    message: "Color created successfully",
    color,
  });
});

/**
 * @desc Get all color
 * @route GET /api/v1/color
 * @access Public
 */

export const getAllColorCtrl = expressAsyncHandler(async (req, res) => {
  const color = await Color.find({});

  res.json({
    status: "success",
    message: "Color fetched successfully",
    color,
  });
});

/**
 * @desc Get single color
 * @route GET /api/v1/color/:id
 * @access Public
 */

export const getSingleColorCtrl = expressAsyncHandler(async (req, res) => {
  const color = await Color.findById(req.params.id);

  res.json({
    status: "success",
    message: "Color fetched successfully",
    color,
  });
});

/**
 * @desc Update Color
 * @route GET /api/v1/color/:id
 * @access Public
 */

export const updateColorCtrl = expressAsyncHandler(async (req, res) => {
  const { name } = req.body;
  const color = await Color.findByIdAndUpdate(
    req.params.id,
    {
      name:name.toLowerCase(),
    },
    {
      new: true,
    }
  );

  if(!color)
    throw new Error('Color not found')
  res.json({
    status: "success",
    messag: "Color updated successfully",
    color,
  });
});


/**
 * @desc delete colors
 * @route DELETE /api/colors/:id/delete
 * @access Private/Admin
 */
export const deleteColorCtrl = expressAsyncHandler(async (req, res) => {
    const id = req.params.id;
   await Color.findByIdAndDelete(id);
    return res.json({
      stauts: "success",
      message: "Color deleted successfully",
    });
  });