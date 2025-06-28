import express from "express";
import {
  addCategory,
  editCategory,
  getAllGategories,
  getCoursesWithCategory,
} from "../controllers/CategoryController.js";
import { protectEducator } from "../middlewares/authMiddleware.js";
import upload from "../configs/multer.js";

const categoryRouter = express.Router();

categoryRouter.get("/all/:id", getAllGategories);
categoryRouter.get("/:id", getCoursesWithCategory);
categoryRouter.post(
  "/add",
  upload.single("image"),
  protectEducator,
  addCategory
);
categoryRouter.patch("/edit", protectEducator, editCategory);

export default categoryRouter;
