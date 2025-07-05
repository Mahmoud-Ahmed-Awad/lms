import mongoose from "mongoose";

const partSchma = new mongoose.Schema({
  type: {
    type: String,
    enum: ["chapter", "lecture"],
    required: true,
  },
  part: {
    type: String,
    required: true,
  },
});

const promoCodeSchema = new mongoose.Schema(
  {
    educator: {
      type: String,
      ref: "User",
      required: true,
    },
    code: {
      type: String,
      required: true,
      uniqe: true,
    },
    type: {
      type: String,
      enum: ["full", "chapter", "lecture"],
      required: true,
    },
    courseId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Course",
      required: true,
    },
    chapterId: {
      type: String,
    },

    lectureId: {
      type: String,
    },
    used: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

const PromoCode = mongoose.model("PromoCode", promoCodeSchema);

export default PromoCode;
