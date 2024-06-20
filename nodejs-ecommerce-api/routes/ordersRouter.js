import express from "express";
import { isLoggedIn } from "../middlewares/isLoggedIn.js";
import { createOrderCtrl, getAllOrderCtrl, getSalesSumCtrl, getSingleOrder, updateOrderCtrl } from "../controllers/orderCtlr.js";


const ordersRouter = express.Router();

ordersRouter.post("/", isLoggedIn, createOrderCtrl);
ordersRouter.get("/", isLoggedIn, getAllOrderCtrl);
ordersRouter.get("/:id", isLoggedIn, getSingleOrder);
ordersRouter.get('/sales/sum',isLoggedIn,getSalesSumCtrl);
ordersRouter.put("/update/:id", isLoggedIn, updateOrderCtrl);

export default ordersRouter;
