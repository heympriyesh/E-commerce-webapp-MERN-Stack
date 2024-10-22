import expressAsyncHandler from "express-async-handler";
import Review from "../model/Review.js";
import Product from "../model/Product.js";

/**
 * @desc Create new review
 * @route POST /api/v1/reviews
 * @access Private/Admin
 */

export const createReviewCtrl=expressAsyncHandler(async (req,res)=>{
    const {product,message,rating}=req.body;
    // 1. Find the prouduct
    const {productID}=req.params;
    const productFound=await Product.findById(productID).populate('reviews');
    if(!productFound)
        throw new Error('Product Not Found');

    // check if user already reviewed this product
    const hasReviewed=productFound?.reviews?.find((review)=>{
        return review?.user?.toString() === req?.userAuthId?.toString();
    });

    if(hasReviewed)
        throw new Error('You hve already reviewd this product');

    // create review
    const review= await Review.create({
        message,
        rating,
        product:productFound?._id,
        user:req.userAuthId
    })
    // Push review into product Found
    productFound.reviews.push(review?._id);

    // resave
    await productFound.save();
    res.json({
        success:true,
        message:"Review created successfully"
    })
})