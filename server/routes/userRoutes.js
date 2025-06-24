import express from "express";
import {
  addUserRating,
  getUserCourseProgress,
  getUserData,
  purchaseCourse,
  updateUserCourseProgress,
  userEnrolledCourses,
} from "../controllers/userController.js";
import { checkDevicesLimt } from "../middlewares/authMiddleware.js";

const userRouter = express.Router();

userRouter.get("/data", checkDevicesLimt, getUserData);
userRouter.get("/enrolled-courses", userEnrolledCourses);
userRouter.post("/purchase", purchaseCourse);

userRouter.patch("/update-course-progress", updateUserCourseProgress);
userRouter.get("/get-course-progress/:courseId", getUserCourseProgress);
userRouter.post("/add-rating", addUserRating);

export default userRouter;
