import { clerkClient } from "@clerk/express";
import Session from "../models/Session.js";
// import User from "../models/User.js";

// Middleware (Protect Educator Routes)
export const protectEducator = async (req, res, next) => {
  try {
    const userId = req.auth().userId;
    const response = await clerkClient.users.getUser(userId);

    if (response.publicMetadata.role !== "educator") {
      return res.status(403).json({
        success: false,
        message: "Unauthorized Access",
      });
    }

    next();
  } catch (error) {
    console.error("Error in protectEducator middleware:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

export const checkDevicesLimt = async (req, res, next) => {
  const { sessionId, userId } = req.auth();
  // const user = await clerkClient.users.getUser(userId);
  // if (user.publicMetadata.role === "educator") {
  //   return next();
  // }
  const allSessions = await Session.find({ userId });
  if (allSessions.length > 1) {
    const sessionsTime = allSessions.map(
      (session) => new Date(session.createdAt)
    );
    const oldestSession = await Session.findOne({
      createdAt: Math.min.apply(null, sessionsTime),
    });
    if (oldestSession._id.toString() !== sessionId.toString()) {
      // const {sginOut} = useClerk
      return res.status(400).json({
        success: false,
        logout: true,
        message: "You Can't Login On More Than One Device",
      });
    }
  }
  next();
};
