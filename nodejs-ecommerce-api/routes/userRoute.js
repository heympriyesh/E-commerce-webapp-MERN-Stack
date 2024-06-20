import express from 'express';
import { getUserProfile, loginUserCtrl, registerUserCtrl, updateShippingAddressCtrl } from '../controllers/userCtrl.js';
import { isLoggedIn } from '../middlewares/isLoggedIn.js';

const userRoutes=express.Router();

userRoutes.post('/register',registerUserCtrl);
userRoutes.post('/login',loginUserCtrl);
userRoutes.get('/profile',isLoggedIn,getUserProfile);
userRoutes.put('/update/shipping',isLoggedIn,updateShippingAddressCtrl)


export default userRoutes;