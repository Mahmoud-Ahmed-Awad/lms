import mongoose from "mongoose";

const partSchema = new mongoose.Schema({
  type: {
    course: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Course",
    },
    chapterId: {
      type: String,
    },
    lectureId: {
      type: String,
    },
  },
});

const typeSchema = new mongoose.Schema({
  type: {
    type: String,
    enum: ["course", "chapter", "lecture"],
  },
  part: partSchema,
});

const userSchema = new mongoose.Schema(
  {
    _id: {
      type: String,
      required: true,
      // default: () => new mongoose.Types.ObjectId().toString(),
    },
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      // unique: true,
    },
    isEducator: {
      type: Boolean,
      default: false,
    },
    imageUrl: { type: String, required: true },
    enrollments: [typeSchema],
  },
  { timestamps: true }
);

const User = mongoose.model("User", userSchema);

export default User;
