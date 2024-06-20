import express from 'express';
import { isLoggedIn } from '../middlewares/isLoggedIn.js';
import { createProductCtrl, deleteProductCtrl, geSingleProduct, getProducts, updateProductCtlr } from '../controllers/productCtrl.js';
import uplaod from '../config/fileUpload.js';
import isAdmin from '../middlewares/isAdmin.js';

const productRouter=express.Router();

productRouter.post('/',isLoggedIn,isAdmin,uplaod.array('files'),createProductCtrl);
productRouter.get('/',getProducts)
productRouter.get('/:id',geSingleProduct);
productRouter.put('/:id',isLoggedIn,isAdmin,updateProductCtlr);
productRouter.delete('/:id/delete',isLoggedIn,isAdmin,deleteProductCtrl);



export default productRouter;