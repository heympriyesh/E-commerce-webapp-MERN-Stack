import expressAsyncHandler from "express-async-handler";
import Product from "../model/Product.js";
import Category from "../model/Category.js";
import Brand from "../model/Brand.js";

/**
 * @desc Create new Product
 * @route POST /api/v1/products
 * @access Private/Admin
 */
export const createProductCtrl = expressAsyncHandler(async (req, res) => {
  const { name, description, category, sizes, colors, price, totalQty, brand } =
    req.body;

  const productExists = await Product.findOne({ name });
  if (productExists) throw new Error("Product Already Exists");

  // find the category
  const categoryFound = await Category.findOne({
    name: category.toLowerCase(),
  });
  if (!categoryFound) {
    throw new Error(
      "Category not found, please create category first or check category name"
    );
  }

  // find the brand
  const brandFound = await Brand.findOne({
    name: brand.toLowerCase(),
  });
  if (!brandFound) {
    throw new Error(
      "Brand not found, please create brand first or check category name"
    );
  }
  const product = await Product.create({
    name,
    description,
    category,
    sizes,
    colors,
    user: req.userAuthId || null,
    price,
    totalQty,
    brand,
    images:req.files.map(data=>data.path)
  });

  // push the product into category
  categoryFound.products.push(product._id);
  // resave
  await categoryFound.save();

  // push the product into brand
  brandFound.products.push(product._id);
  // resave the brand
  await brandFound.save();

  // send response
  res.json({
    status: "success",
    message: "Product created successfully",
    product,
  });
});

/**
 * @desc Get all products
 * @route GET /api/v1/products
 * @access Public
 */

export const getProducts = expressAsyncHandler(async (req, res) => {
  let productQuery = Product.find();
  if (req.query.name) {
    productQuery = productQuery.find({
      name: { $regex: req.query.name, $options: "i" },
    });
  }
  if (req.query.brand) {
    productQuery = productQuery.find({
      brand: { $regex: req.query.brand, $options: "i" },
    });
  }

  if (req.query.category) {
    productQuery = productQuery.find({
      category: { $regex: req.query.category, $options: "i" },
    });
  }

  if (req.query.colors) {
    productQuery = productQuery.find({
      colors: { $regex: req.query.colors, $options: "i" },
    });
  }

  if (req.query.sizes) {
    productQuery = productQuery.find({
      sizes: { $regex: req.query.sizes, $options: "i" },
    });
  }

  if (req.query.price) {
    const priceRange = req.query.price.split("-");

    productQuery = productQuery.find({
      price: { $gte: priceRange[0], $lte: priceRange[1] },
    });
  }
  // pagination
  // page
  const page = parseInt(req.query.page) ? parseInt(req.query.page) : 1;
  // limit
  const limit = parseInt(req.query.limit) ? parseInt(req.query.limit) : 10;

  // startidx
  const startIndex = (page - 1) * limit;
  // endIdx
  const endIndex = page * limit;

  // total
  const total = await Product.countDocuments();

  productQuery = productQuery.skip(startIndex).limit(limit);
  // pagination results
  const pagination = {};
  if (endIndex < total) {
    pagination.next = {
      page: page + 1,
      limit,
    };
  }

  if (startIndex > 0) {
    pagination.prev = {
      page: page - 1,
      limit,
    };
  }

  const products = await productQuery.populate('reviews');
  return res.json({
    status: "success",
    results: products.length,
    pagination,
    message: "Product fetched successfully",
    products,
  });
});

/**
 * @desc Get single product
 * @route GET /api/products/:id
 * @access Public
 */
export const geSingleProduct = expressAsyncHandler(async (req, res) => {
  const id = req.params.id;
  const product = await Product.findById(id).populate('reviews');
  if (!product) throw new Error("Product not found");
  return res.json({
    stauts: "success",
    message: "prouct fetched successfully",
    product,
  });
});

/**
 * @desc update product
 * @route PUT /api/products/:id
 * @access Public
 */
export const updateProductCtlr = expressAsyncHandler(async (req, res) => {
  const { name, description, category, sizes, colors, price, totalQty, brand } =
    req.body;
  const product = await Product.findByIdAndUpdate(
    req.params.id,
    {
      name,
      description,
      category,
      sizes,
      colors,
      price,
      totalQty,
      brand,
    },
    {
      new: true,
    }
  );

  res.json({
    status: "success",
    messag: "Product updated successfully",
    product,
  });
});

/**
 * @desc delete product
 * @route DELETE /api/products/:id/delete
 * @access Private/Admin
 */
export const deleteProductCtrl = expressAsyncHandler(async (req, res) => {
  const id = req.params.id;
  await Product.findByIdAndDelete(id);
  return res.json({
    stauts: "success",
    message: "prouct deleted successfully",
  });
});
