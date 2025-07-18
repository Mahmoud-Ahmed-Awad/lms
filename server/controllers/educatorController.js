import Course from "../models/Course.js";
import User from "../models/User.js";
import { v2 as cloudinary } from "cloudinary";
import Purchase from "../models/Purchase.js";

export const getAllEducators = async (req, res) => {
  try {
    const educators = await User.find({ isEducator: true }).select([
      "-enrollments",
    ]);
    res.status(200).json({ success: true, educators });
  } catch (error) {
    res.status(500).json({ sucess: false, message: error.message });
  }
};

// Get Educator Courses
export const getEducatorCourses = async (req, res) => {
  try {
    const educator = req.auth().userId;

    const courses = await Course.find({ educator });

    res.status(200).json({
      success: true,
      courses,
    });
  } catch (error) {
    console.error("Error fetching educator courses:", error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const updateRoleToEducator = async (req, res) => {
  try {
    const { userId } = req.auth();

    await User.findByIdAndUpdate(userId, { isEducator: true });

    res.json({ success: true, message: "You can publish a course now" });
  } catch (error) {
    console.error("Error updating user role:", error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

// Add New Course
export const addCourse = async (req, res) => {
  try {
    const { courseData } = req.body;
    const imageFile = req.file;
    const educatorId = req.auth().userId;

    if (!imageFile) {
      return res
        .status(400)
        .json({ success: false, message: "Thumbnail Not Attached" });
    }

    const parsedCourseData = await JSON.parse(courseData);
    parsedCourseData.educator = educatorId;
    const newCourse = await Course.create(parsedCourseData);
    await newCourse.save();
    const imageUpload = await cloudinary.uploader.upload(imageFile.path);
    newCourse.courseThumbnail = imageUpload.secure_url;
    await newCourse.save();

    res.status(201).json({
      success: true,
      message: "Course Added",
    });
  } catch (error) {
    console.error("Error adding course:", error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

// Get Educator Dashboard Data (Total Earnings, Enrolled Students, No. Of Courses)
export const educatorDashboardData = async (req, res) => {
  try {
    const educator = req.auth().userId;
    const courses = await Course.find({ educator: educator });
    const totalCourses = courses.length;

    const courseIds = courses.map((course) => course._id);

    // Calculate total earnings from purchases
    const purchases = await Purchase.find({
      courseId: { $in: courseIds },
      status: "completed",
    });

    const totalEarnings = purchases.reduce(
      (sum, purchase) => sum + purchase.amount,
      0
    );

    // Calculate unique enrolled students IDs with their course titles
    const enrolledStudentsData = [];
    for (const course of courses) {
      const students = await User.find(
        { _id: { $in: course.enrolledStudents } },
        "name imageUrl"
      );

      students.forEach((student) => {
        enrolledStudentsData.push({
          courseTitle: course.courseTitle,
          student,
        });
      });
    }

    res.status(200).json({
      success: true,
      dashboardData: { totalEarnings, enrolledStudentsData, totalCourses },
    });
  } catch (error) {
    console.error("Error fetching educator dashboard data:", error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

// Get Enrolled Students Data With Purchase Data
export const getEnrolledStudentsData = async (req, res) => {
  try {
    const educator = req.auth().userId;
    const courses = await Course.find({ educator: educator });
    const courseIds = courses.map((course) => course._id);

    const purchases = await Purchase.find({
      courseId: { $in: courseIds },
      status: "completed",
    })
      .populate("userId", "name imageUrl")
      .populate("courseId", "courseTitle");

    const enrolledStudents = purchases.map((purchase) => ({
      student: purchase.userId,
      courseTitle: purchase.courseId.courseTitle,
      purchaseDate: purchase.createdAt,
    }));

    res.status(200).json({
      success: true,
      enrolledStudents,
    });
  } catch (error) {
    console.error("Error fetching enrolled students data:", error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

// Function To Edit Course
export const editCourse = async (req, res) => {
  try {
    const { userId } = req.auth();
    const { courseData } = req.body;
    const imageFile = req.file;

    if (userId && courseData) {
      const newCourseData = JSON.parse(courseData);
      const currentCourse = await Course.findById(newCourseData.courseId);

      if (currentCourse) {
        if (currentCourse.educator === userId) {
          if (!imageFile) {
            return res
              .status(400)
              .json({ success: false, message: "Thumbnail Not Attached" });
          }
          await cloudinary.uploader.destroy(
            currentCourse.courseThumbnail.split("/").pop().split(".").shift()
          );
          const imageUpload = await cloudinary.uploader.upload(imageFile.path);
          newCourseData.courseThumbnail = imageUpload.secure_url;
          await Course.findByIdAndUpdate(currentCourse._id, newCourseData);
          return res
            .status(200)
            .json({ success: true, courseData: newCourseData });
        } else {
          return res.status(400).json({
            success: false,
            message: "You Don't Have Access To This Course",
          });
        }
      } else {
        return res
          .status(404)
          .json({ success: false, message: "Course Not Found" });
      }
    }
  } catch (error) {
    console.log("Error On Edit Course:", error);

    return res.status(500).json({ success: false, message: error.message });
  }
};
