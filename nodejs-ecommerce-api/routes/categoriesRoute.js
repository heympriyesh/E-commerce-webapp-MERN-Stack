import express from 'express';
import { isLoggedIn } from '../middlewares/isLoggedIn.js';
import { createCategoryCtrl,getAllCategoriesCtrl,getSingleCategoryCtrl,updateCategoryCtrl,deleteCategoryCtrl } from '../controllers/categoriesCtrl.js';
import uplaod from '../config/fileUpload.js';

const categoriesRouter=express.Router();

categoriesRouter.post('/',isLoggedIn,uplaod.single('file'),createCategoryCtrl);
categoriesRouter.get('/',getAllCategoriesCtrl);
categoriesRouter.get('/:id',getSingleCategoryCtrl);
categoriesRouter.delete('/:id/delete',deleteCategoryCtrl);
categoriesRouter.put('/:id',updateCategoryCtrl);

export default categoriesRouter;