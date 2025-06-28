import mongoose from "mongoose";

const CategorySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  createdBy: {
    type: String,
    ref: "User",
    required: true,
  },
  thumbnail: {
    type: String,
    default: "",
  },
});

const Category = mongoose.model("Category", CategorySchema);

export default Category;
