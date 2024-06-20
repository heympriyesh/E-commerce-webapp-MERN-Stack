import expressAsyncHandler from "express-async-handler";
import Category from "../model/Category.js";

/**
 * @desc Create new Category
 * @route POST /api/v1/categories
 * @access Private/Admin
 */

export const createCategoryCtrl = expressAsyncHandler(async (req, res) => {
  const { name } = req.body;
  // category exists
  const categoryFound = await Category.findOne({ name:name.toLowerCase() });
  if (categoryFound) throw new Error("Category already exits");

  // create
  const category = await Category.create({
    name:name.toLowerCase(),
    user: req.userAuthId,
    image:req.file.path
  });

  res.json({
    status: "success",
    message: "Category created successfully",
    category,
  });
});

/**
 * @desc Get all categories
 * @route GET /api/v1/categories
 * @access Public
 */

export const getAllCategoriesCtrl = expressAsyncHandler(async (req, res) => {
  const categories = await Category.find({});

  res.json({
    status: "success",
    message: "Category fetched successfully",
    categories,
  });
});

/**
 * @desc Get single categories
 * @route GET /api/v1/categories/:id
 * @access Public
 */

export const getSingleCategoryCtrl = expressAsyncHandler(async (req, res) => {
  const category = await Category.findById(req.params.id);

  res.json({
    status: "success",
    message: "Category fetched successfully",
    category,
  });
});

/**
 * @desc Update category
 * @route GET /api/v1/categories/:id
 * @access Public
 */

export const updateCategoryCtrl = expressAsyncHandler(async (req, res) => {
  const { name } = req.body;
  const category = await Category.findByIdAndUpdate(
    req.params.id,
    {
      name:name.toLowerCase(),
    },
    {
      new: true,
    }
  );

  if(!category)
    throw new Error('Category not found')
  res.json({
    status: "success",
    messag: "Category updated successfully",
    category,
  });
});


/**
 * @desc delete catgories
 * @route DELETE /api/catgories/:id/delete
 * @access Private/Admin
 */
export const deleteCategoryCtrl = expressAsyncHandler(async (req, res) => {
    const id = req.params.id;
   await Category.findByIdAndDelete(id);
    return res.json({
      stauts: "success",
      message: "Category deleted successfully",
    });
  });