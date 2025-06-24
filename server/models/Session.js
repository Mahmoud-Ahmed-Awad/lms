import mongoose from "mongoose";

const sessionSchema = new mongoose.Schema(
  {
    _id: { type: String, required: true },
    userId: { type: String, ref: "User", required: true },
  },
  { timestamps: true }
);

const Session = mongoose.model("Session", sessionSchema);

export default Session;
