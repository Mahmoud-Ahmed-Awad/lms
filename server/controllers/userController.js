import Stripe from "stripe";
import Course from "../models/Course.js";
import Purchase from "../models/Purchase.js";
import User from "../models/User.js";

// Get User Data
export const getUserData = async (req, res) => {
  try {
    const userId = req.auth().userId;
    const user = await User.findById(userId);

    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    req.status(200).json({
      success: true,
      user,
    });
  } catch (error) {
    console.error("Error fetching user data:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

// Users Enrolled Courses With Lecture Links
export const userEnrolledCourses = async (req, res) => {
  try {
    const userId = req.auth().userId;
    const userData = await User.findById(userId).populate("enrolledCourses");

    res.status(200).json({
      success: true,
      enrolledCourses: userData.enrolledCourses,
    });
  } catch (error) {
    console.error("Error fetching enrolled courses:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

// Purchase Course
export const purchaseCourse = async (req, res) => {
  try {
    const { courseId } = req.body;
    const { origin } = req.headers;
    const userId = req.auth().userId;
    const userData = await User.findById(userId);
    const courseData = await Course.findById(courseId);

    if (!userData || !courseData) {
      return res
        .status(404)
        .json({ success: false, message: "Data not found" });
    }

    const purchaseData = {
      courseId: courseData._id,
      userId: userData._id,
      amount: (
        courseData.coursePrice -
        (courseData.discount * courseData.coursePrice) / 100
      ).toFixed(2),
    };

    const newPurchase = await Purchase.create(purchaseData);

    // Stripe Getway Initialize
    const stripeInstance = new Stripe(process.env.STRIPE_SECRET_KEY);

    const currency = process.env.CURRENCY.toLocaleLowerCase();

    // Creating line items for Stripe
    const line_items = [
      {
        price_data: {
          currency,
          product_data: {
            name: courseData.courseTitle,
          },
          unit_amount: Math.floor(newPurchase.amount) * 100,
        },
        quantity: 1,
      },
    ];
    const session = await stripeInstance.checkout.sessions.create({
      success_url: `${origin}/loading/my-enrollments`,
      cancel_url: `${origin}/`,
      line_items,
      mode: "payment",
      metadata: {
        purchaseId: newPurchase._id.toString(),
      },
    });

    res.status(200).json({
      success: true,
      session_url: session.url,
    });
  } catch (error) {
    console.error("Error purchasing course:", error);
    return res.status(500).json({ success: false, message: error.message });
  }
};
