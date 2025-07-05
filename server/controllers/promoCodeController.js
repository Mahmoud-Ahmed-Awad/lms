import gen from "@codedipper/random-code";
import PromoCode from "../models/PromoCode.js";
import Course from "../models/Course.js";
import User from "../models/User.js";

// Function to create one promo code
export const createPromoCode = async (req, res) => {
  const { courseId, type, chapterId, lectureId } = req.body;
  const { userId } = req.auth();

  if (!courseId || !type) {
    return res
      .status(400)
      .json({ success: false, message: "Type And Course Are Required" });
  }

  if (!["full", "chapter", "lecture"].includes(type.toLowerCase())) {
    return res
      .status(400)
      .json({ success: false, message: "Type Should Be Full or Part" });
  }

  if (type.toLowerCase() === "chapter" && !chapterId) {
    return res
      .status(400)
      .json({ success: false, message: "Chapter Is Required" });
  }

  if (type.toLowerCase() === "lecture" && !lectureId) {
    return res
      .status(400)
      .json({ success: false, message: "lecture Is Required" });
  }

  try {
    const newPromoCode = new PromoCode({
      educator: userId,
      type,
      courseId,
      code: gen(10),
    });

    if (type.toLowerCase() != "full") {
      newPromoCode.chapterId = chapterId;
      if (type.toLowerCase() == "lecture") {
        newPromoCode.lectureId = lectureId;
      }
    }

    await newPromoCode.save();

    return res.status(201).json({ success: true, promoCode: newPromoCode });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const getAllPromoCodes = async (req, res) => {
  const { userId } = req.auth();

  try {
    const promoCodes = await PromoCode.find({ educator: userId });

    return res.status(200).json({ success: true, promoCodes });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const redeemCode = async (req, res) => {
  const { code } = req.body;
  const { userId } = req.auth();

  if (!userId) {
    return res
      .status(400)
      .json({ success: true, message: "Login Is Required" });
  }

  if (!code) {
    return res.status(400).json({ success: true, message: "Code Is Required" });
  }

  try {
    const promoCode = await PromoCode.findOne({ code });

    if (!promoCode) {
      return res
        .status(400)
        .json({ success: false, message: "Code Isn't Define" });
    }

    if (promoCode.used) {
      return res
        .status(400)
        .json({ success: false, message: "Code Is Already Used" });
    }

    const course = await Course.findById(promoCode.courseId);

    if (userId == promoCode.educator) {
      return res.status(400).json({
        success: false,
        message: "You Can't Redeem Code For Your Course",
      });
    }

    const user = await User.findById(userId);

    if (promoCode.type == "full") {
      course.enrolledStudents.push(userId);
      user.enrollments.push({
        type: "course",
        part: { courseId: promoCode.courseId },
      });
    } else if (promoCode.type == "chapter") {
      user.enrollments.push({
        type: "chapter",
        part: { courseId: promoCode.courseId, chapterId: promoCode.chapterId },
      });
    } else {
      user.enrollments.push({
        type: "lecture",
        part: {
          course: promoCode.courseId,
          chapterId: promoCode.chapterId,
          lectureId: promoCode.lectureId,
        },
      });
    }

    await user.save();

    promoCode.used = true;

    await promoCode.save();

    return res.json({ success: true, message: "Redeem Sucessfully" });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};
