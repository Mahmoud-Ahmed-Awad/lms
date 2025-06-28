import express from "express";
import {
  getAllCourses,
  getCourseId,
  getEducatorCourses,
} from "../controllers/CourseController.js";

const courseRouter = express.Router();

courseRouter.get("/all", getAllCourses);
courseRouter.get("/:id", getCourseId);
courseRouter.get("/educator/:id", getEducatorCourses);

export default courseRouter;
