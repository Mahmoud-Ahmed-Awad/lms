import express from "express";
import {
  addUserRating,
  getUserCourseProgress,
  getUserData,
  purchaseCourse,
  updateUserCourseProgress,
  userEnrollments,
} from "../controllers/userController.js";

const userRouter = express.Router();

userRouter.get("/data", getUserData);
userRouter.get("/enrollments", userEnrollments);
userRouter.post("/purchase", purchaseCourse);

userRouter.patch("/update-course-progress", updateUserCourseProgress);
userRouter.get("/get-course-progress/:courseId", getUserCourseProgress);
userRouter.post("/add-rating", addUserRating);

export default userRouter;
