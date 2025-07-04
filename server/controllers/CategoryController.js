import Category from "../models/Category.js";
import Course from "../models/Course.js";
import User from "../models/User.js";
import { v2 as cloudinary } from "cloudinary";

// Function To Get All Categories
export const getAllGategories = async (req, res) => {
  try {
    const educatorId = req.params.id;
    const educator = await User.findById(educatorId).select(["-enrollments"]);
    const categories = await Category.find({ createdBy: educatorId });
    return res.status(200).json({ success: true, educator, categories });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// Get All Courses With One Category
export const getCoursesWithCategory = async (req, res) => {
  try {
    const categoryId = req.params.id;
    const category = await Category.findById(categoryId);
    if (!category) {
      return res
        .status(404)
        .json({ success: false, message: "Category Not Found" });
    }
    const courses = await Course.find({ category: categoryId });
    return res.status(200).json({ success: true, courses });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// Function To Create New Category
export const addCategory = async (req, res) => {
  try {
    const { name, description } = req.body;
    const thumbnail = req.file;
    const { userId } = req.auth();
    const userData = await User.findById(userId);

    if (!userData.isEducator) {
      return res
        .status(400)
        .json({ success: false, message: "You Not Educator" });
    }

    if ((!name, !description, !thumbnail)) {
      return res.status(400).json({
        success: false,
        message: "Name, Description And Thumbnail Are Required",
      });
    }

    const newCategory = await Category.create({
      name,
      description,
      createdBy: userId,
    });
    await newCategory.save();
    const imageUpload = await cloudinary.uploader.upload(thumbnail.path);
    newCategory.thumbnail = imageUpload.secure_url;
    await newCategory.save();
    return res.status(201).json({ success: true, category: newCategory });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// Edit Category
export const editCategory = async (req, res) => {
  try {
    const { name, description, categoryId } = req.body;
    const thumbnail = req.file;
    const { userId } = req.auth();

    const selectedCategory = await Category.findById(categoryId);

    if (!selectedCategory) {
      return res
        .status(404)
        .json({ success: false, message: "Category Not Found" });
    }

    if (userId !== selectedCategory.createdBy) {
      return res.status(400).json({
        success: false,
        message: "You Don;t Have Access To This Category",
      });
    }

    if ((!name, !description, !thumbnail)) {
      return res.status(400).json({
        success: false,
        message: "Name, Description And Thumbnail Are Required",
      });
    }

    selectedCategory.name = name;
    selectedCategory.description = description;
    await selectedCategory.save();
    await cloudinary.uploader.destroy(
      selectedCategory.thumbnail.split("/").pop().split(".").shift()
    );
    const imageUpload = await cloudinary.uploader.upload(thumbnail.path);
    selectedCategory.thumbnail = imageUpload.secure_url;
    await selectedCategory.save();
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};
