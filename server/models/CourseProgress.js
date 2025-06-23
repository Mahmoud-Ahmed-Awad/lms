import mongoose from "mongoose";

const courseProgressSchema = new mongoose.Schema(
  {
    userId: {
      type: String,
      required: true,
    },
    courseId: {
      type: String,
      required: true,
    },
    complated: {
      type: Boolean,
      default: false,
    },
    lectureCompleted: [],
  },
  { minimize: false }
);

const CourseProgress = mongoose.model("CourseProgress", courseProgressSchema);

export default CourseProgress;
