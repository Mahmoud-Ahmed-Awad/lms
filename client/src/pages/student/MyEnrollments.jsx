import { useContext, useEffect, useState } from "react";
import { AppContext } from "../../context/AppContext";
import { Line } from "rc-progress";
import Loading from "../../components/students/Loading";
import Footer from "../../components/students/Footer";
import { toast } from "react-toastify";
import axios from "axios";
import { assets } from "../../assets/assets";

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

  const [redeemCodePopup, setRedeemCodePopup] = useState(false);
  const [code, setCode] = useState(null);

  const redeemCode = async () => {
    try {
      const token = await getToken();
      const { data } = await axios.post(
        backendUrl + "/api/promo-code/redeem",
        { code },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (data.success) {
        window.location.reload();
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

  const getCourseProgress = async () => {
    try {
      const token = await getToken();
      const tempProgressArray = await Promise.all(
        enrollments.map(async (enrolledItem) => {
          const { data } = await axios.get(
            `${backendUrl}/api/user/get-course-progress/${enrolledItem.part.course._id}`,
            {
              headers: { Authorization: `Bearer ${token}` },
            }
          );

          let totalLectures = calculateNoOfLectures(enrolledItem.part.course);

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
        <div className="flex justify-between">
          <h1 className="text-2xl font-semibold">My Enrollments</h1>
          <button
            className="bg-blue-600 px-4 py-2 text-white rounded cursor-pointer"
            onClick={() => setRedeemCodePopup(true)}
          >
            Redeem Code
          </button>
          {redeemCodePopup && (
            <div className="fixed inset-0 flex items-center justify-center bg-gray-800/50">
              <div className="bg-white text-gray-700 p-4 rounded relative w-full max-w-80">
                <h2 className="text-lg font-semibold mb-4">Redeem Code</h2>

                <div className="mb-2">
                  <p>Promo Code</p>
                  <input
                    type="text"
                    className="mt-1 block w-full border rounded py-1 px-2"
                    value={code}
                    onChange={(e) => setCode(e.target.value)}
                  />
                </div>

                <button
                  type="button"
                  className="w-full bg-blue-400 text-white px-4 py-2 rounded"
                  onClick={redeemCode}
                >
                  Redeem
                </button>

                <img
                  onClick={() => setRedeemCodePopup(false)}
                  src={assets.cross_icon}
                  alt=""
                  className="absolute top-4 right-4 cursor-pointer w-4"
                />
              </div>
            </div>
          )}
        </div>
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
