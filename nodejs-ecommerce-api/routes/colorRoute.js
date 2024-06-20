import express from "express";
import { isLoggedIn } from "../middlewares/isLoggedIn.js";
import { createColorCtrl, deleteColorCtrl, getAllColorCtrl, getSingleColorCtrl, updateColorCtrl } from "../controllers/colorsCtrl.js";
import isAdmin from "../middlewares/isAdmin.js";

const colorRouter = express.Router();

colorRouter.post("/", isLoggedIn,isAdmin, createColorCtrl);
colorRouter.get("/", getAllColorCtrl);
colorRouter.get("/:id",getSingleColorCtrl);
colorRouter.delete("/:id/delete",isLoggedIn, isAdmin,deleteColorCtrl);
colorRouter.put("/:id",isLoggedIn, isAdmin,updateColorCtrl);

export default colorRouter;
