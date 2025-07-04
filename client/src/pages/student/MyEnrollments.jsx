import { useContext, useEffect, useState } from "react";
import { AppContext } from "../../context/AppContext";
import { Line } from "rc-progress";
import Loading from "../../components/students/Loading";
import Footer from "../../components/students/Footer";
import { toast } from "react-toastify";
import axios from "axios";

const MyEnrollments = () => {
  const {
    enrollments,
    calculateCourseDuration,
    navigate,
    userData,
    fetchUserEnrollments,
    backendUrl,
    getToken,
    calculateNoOfLectures,
  } = useContext(AppContext);

  const [progressArray, setProgressArray] = useState([]);

  const getCourseProgress = async () => {
    try {
      const token = await getToken();
      const tempProgressArray = await Promise.all(
        enrollments.map(async (course) => {
          const { data } = await axios.get(
            `${backendUrl}/api/user/get-course-progress/${course._id}`,
            {
              headers: { Authorization: `Bearer ${token}` },
            }
          );

          let totalLectures = calculateNoOfLectures(course);

          const lecturesComplated = data.progress?.lectureCompleted
            ? data.progress.lectureCompleted.length
            : 0;

          return { totalLectures, lecturesComplated };
        })
      );

      setProgressArray(tempProgressArray);
    } catch (error) {
      if (error.response?.data?.message) {
        toast.error(error.response.data.message);
      } else {
        toast.error(error.message);
      }
    }
  };

  useEffect(() => {
    if (userData) {
      fetchUserEnrollments();
    }
  }, [userData]);

  useEffect(() => {
    if (enrollments && enrollments.length > 0) {
      getCourseProgress();
    }
  }, [enrollments]);

  return enrollments ? (
    <>
      <div className="md:px-36 px-8 pt-10">
        <h1 className="text-2xl font-semibold">My Enrollments</h1>
        <table className="md:table-auto table-fixed w-full overflow-hidden border border-gray-300 mt-10">
          <thead className="text-gray-900 border-b border-gray-500/20 text-sm text-left max-sm:hidden">
            <tr>
              <th className="px-4 py-3 font-semibold truncate">Course</th>
              <th className="px-4 py-3 font-semibold truncate">Duration</th>
              <th className="px-4 py-3 font-semibold truncate">Complated</th>
              <th className="px-4 py-3 font-semibold truncate">Status</th>
            </tr>
          </thead>
          <tbody className="text-gray-700">
            {enrollments.map((enrolledItem, index) => (
              <tr key={index} className="border-b border-gray-500/20">
                <td className="md:px-4 pl-2 md:pl-4 py-3 flex items-center space-x-3">
                  <img
                    src={enrolledItem.part.course.courseThumbnail}
                    alt=""
                    className="w-14 sm:w-24 md:w-28"
                  />
                  <div className="flex-1">
                    <p className="mb-1 max-sm:text-sm">
                      {enrolledItem.part.course.courseTitle}
                    </p>
                    <Line
                      strokeWidth={2}
                      percent={
                        progressArray[index]
                          ? (progressArray[index].lecturesComplated * 100) /
                            progressArray[index].totalLectures
                          : 0
                      }
                      className="bg-gray-300 rounded-full"
                    />
                  </div>
                </td>
                <td className="px-4 py-3 max-sm:hidden">
                  {calculateCourseDuration(enrolledItem.part.course)}
                </td>
                <td className="px-4 py-3 max-sm:hidden">
                  {progressArray[index] &&
                    `${progressArray[index].lecturesComplated} / ${progressArray[index].totalLectures}`}{" "}
                  <span>Lectures</span>
                </td>
                <td className="px-4 py-3 max-sm:text-right">
                  <button
                    className="px-3 sm:px-5 py-1.5 sm:py-2 bg-blue-600 max-sm:text-xs text-white cursor-pointer"
                    onClick={() =>
                      navigate("/player/" + enrolledItem.part.course._id)
                    }
                  >
                    {progressArray[index] &&
                    progressArray[index].lecturesComplated /
                      progressArray[index].totalLectures ===
                      1
                      ? "Complated"
                      : "On Going"}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Footer />
    </>
  ) : (
    <Loading />
  );
};

export default MyEnrollments;
