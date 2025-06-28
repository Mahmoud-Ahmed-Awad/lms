import Course from "../models/Course.js";
import User from "../models/User.js";

// Get All Courses
export const getAllCourses = async (req, res) => {
  try {
    const courses = await Course.find({ isPublished: true })
      .select(["-courseContent", "-enrolledStudents"])
      .populate({ path: "educator" });

    res.status(200).json({
      success: true,
      courses,
    });
  } catch (error) {
    console.error("Error fetching courses:", error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

// Get Course by Id
export const getCourseId = async (req, res) => {
  const { id } = req.params;

  try {
    const courseData = await Course.findById(id).populate({ path: "educator" });

    // Check if course educator
    const userId = req.auth().userId;

    if (userId && userId.toString() === courseData.educator._id.toString()) {
      return res
        .status(200)
        .json({ success: true, courseEducator: true, courseData });
    }

    // Remove lectureUrl if isPreviewFree is False
    courseData.courseContent.forEach((chapter) => {
      chapter.chapterContent.forEach((lecture) => {
        if (!lecture.isFreePreview) {
          lecture.lectureUrl = "";
        }
      });
    });

    res.status(200).json({
      success: true,
      courseData,
    });
  } catch (error) {
    console.error("Error fetching course by ID:", error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

// Get Courses With Educator Id
export const getEducatorCourses = async (req, res) => {
  const educatorId = req.params.id;
  try {
    const educator = await User.findById(educatorId);
    if (educator) {
      const educatorCourses = await Course.find({
        educator: educatorId,
      }).select(["-courseContent", "-enrolledStudents"]);
      return res.status(200).json({ success: true, educator, educatorCourses });
    } else {
      return res
        .status(400)
        .json({ success: false, message: "Educator Not Found" });
    }
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};
