import express from "express";
import { isLoggedIn } from "../middlewares/isLoggedIn.js";
import {
  createBrandCtrl,
  deleteBrandCtrl,
  getAllBrandCtrl,
  getSingleBrandCtrl,
  updateBrandCtrl,
} from "../controllers/brandCtrl.js";
import isAdmin from "../middlewares/isAdmin.js";

const brandRouter = express.Router();

brandRouter.post("/", isLoggedIn, createBrandCtrl);
brandRouter.get("/", getAllBrandCtrl);
brandRouter.get("/:id", getSingleBrandCtrl);
brandRouter.delete("/:id/delete", isLoggedIn,isAdmin,deleteBrandCtrl);
brandRouter.put("/:id", isLoggedIn,isAdmin,updateBrandCtrl);

export default brandRouter;
