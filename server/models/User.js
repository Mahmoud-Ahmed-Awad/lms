import mongoose from "mongoose";

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
    enrollments: [
      {
        type: {
          type: {
            type: String,
            enum: ["course", "chapter", "lecture"],
          },
          part: {
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
          },
        },
      },
    ],
  },
  { timestamps: true }
);

const User = mongoose.model("User", userSchema);

export default User;
