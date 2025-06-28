import { createContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import humanizeDuration from "humanize-duration";
import { useAuth, useClerk, useUser } from "@clerk/clerk-react";
import axios from "axios";
import { toast } from "react-toastify";

export const AppContext = createContext();

export const AppContextProvider = (props) => {
  const backendUrl = import.meta.env.VITE_BACKEND_URL;

  const currency = import.meta.env.VITE_CURRENCY;
  const navigate = useNavigate();

  const { getToken } = useAuth();

  const [allCourses, setAllCourses] = useState([]);
  const [allEducators, setAllEducators] = useState([]);
  const [isEducator, setIsEducator] = useState(false);
  const [enrolledCourses, setEnrolledCourses] = useState([]);
  const { user } = useUser();
  const [userData, setUserData] = useState(null);
  const { signOut } = useClerk();

  // Fetch all Courses
  const fetchAllCourses = async () => {
    try {
      const { data } = await axios.get(backendUrl + "/api/course/all");

      if (data.success) {
        setAllCourses(data.courses);
      } else {
        toast.error(data.message || "Failed to fetch courses");
      }
    } catch (error) {
      if (error.response?.data?.message) {
        toast.error(error.response.data.message);
      } else {
        toast.error(error.message);
      }
    }
  };

  // Fetch aLl Educators
  const fetchAllEducators = async () => {
    try {
      const { data } = await axios.get(backendUrl + "/api/educator/all");

      if (data.success) {
        setAllEducators(data.educators);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      if (error.response?.data?.message) {
        toast.error(error.response.data.message);
      } else {
        toast.error(error.message);
      }
    }
  };

  // Fetch userData
  const fetchUserData = async () => {
    try {
      const tokan = await getToken();

      const { data } = await axios.get(backendUrl + "/api/user/data", {
        headers: { Authorization: `Bearer ${tokan}` },
      });

      if (data.success) {
        setUserData(data.user);
        if (data.user.isEducator) {
          setIsEducator(true);
        }
      } else if (data.logout) {
        signOut({ redirectUrl: "/" });
      } else {
        toast.error(data.message || "Failed to fetch user data");
      }
    } catch (error) {
      if (error.response.data.logout) {
        signOut({ redirectUrl: "/" });
      } else {
        if (error.response?.data?.message) {
          toast.error(error.response.data.message);
        } else {
          toast.error(error.message);
        }
      }
    }
  };

  // Function to calculate average ratingof course
  const calculateRating = (course) => {
    if (course.courseRatings.length === 0) {
      return 0;
    }
    let totalRating = 0;
    course.courseRatings.forEach((rating) => {
      totalRating += rating.rating;
    });
    return Math.floor(totalRating / course.courseRatings.length);
  };

  // Function to Calculate Course Chapter Time
  const calculateChapterTime = (chapter) => {
    let time = 0;
    chapter.chapterContent.map((lecture) => (time += lecture.lectureDuration));
    return humanizeDuration(time * 60 * 1000, { units: ["h", "m"] });
  };

  // Function to Calculate Course Duration
  const calculateCourseDuration = (course) => {
    let time = 0;

    course.courseContent.map((chapter) =>
      chapter.chapterContent.map((lecture) => (time += lecture.lectureDuration))
    );
    return humanizeDuration(time * 60 * 1000, { units: ["h", "m"] });
  };

  // Function calculate to No of Lectures in the course
  const calculateNoOfLectures = (course) => {
    let totalLectures = 0;
    course.courseContent.forEach((chapter) => {
      if (Array.isArray(chapter.chapterContent)) {
        totalLectures += chapter.chapterContent.length;
      }
    });
    return totalLectures;
  };

  // Fetch User Enrolled Courses
  const fetchUserEnrolledCourses = async () => {
    try {
      const token = await getToken();
      const { data } = await axios.get(
        backendUrl + "/api/user/enrolled-courses",
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (data.success) {
        setEnrolledCourses(data.enrolledCourses.reverse());
      } else {
        toast.error(data.message || "Failed to fetch enrolled courses");
      }
    } catch (error) {
      if (error.response?.data?.message) {
        toast.error(error.response.data.message);
      } else {
        toast.error(error.message);
      }
    }
  };

  useEffect(() => {
    fetchAllCourses();
    fetchAllEducators();
  }, []);

  useEffect(() => {
    if (!userData && user) {
      fetchUserData();
      fetchUserEnrolledCourses();
    }
  }, [userData, user]);

  const value = {
    currency,
    allCourses,
    navigate,
    calculateRating,
    isEducator,
    setIsEducator,
    calculateChapterTime,
    calculateCourseDuration,
    calculateNoOfLectures,
    enrolledCourses,
    fetchUserEnrolledCourses,
    backendUrl,
    userData,
    setUserData,
    getToken,
    fetchAllCourses,
    allEducators,
  };

  return (
    <AppContext.Provider value={value}>{props.children}</AppContext.Provider>
  );
};
