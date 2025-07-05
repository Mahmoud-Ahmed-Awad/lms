import axios from "axios";
import { useContext } from "react";
import { useEffect } from "react";
import { useState } from "react";
import { toast } from "react-toastify";
import { AppContext } from "../../context/AppContext";
import Loading from "../../components/students/Loading";
import { Link } from "react-router-dom";

const CreatePromoCode = () => {
  const [codeType, setCodeType] = useState("full");

  const { currency, backendUrl, getToken } = useContext(AppContext);

  const [courses, setCourses] = useState(null);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [chapters, setChapters] = useState(null);
  const [lectures, setLactures] = useState(null);
  const [selectedChapter, setSelectedChapter] = useState(null);
  const [selectedLecture, setSelectedLecture] = useState(null);

  const fetchEducatorCourses = async () => {
    try {
      const token = await getToken();
      const { data } = await axios.get(backendUrl + "/api/educator/courses", {
        headers: { Authorization: `Bearer ${token}` },
      });

      data.success && setCourses(data.courses);
    } catch (error) {
      if (error.response?.data?.message) {
        toast.error(error.response.data.message);
      } else {
        toast.error(error.message);
      }
    }
  };

  const fetchCourseData = async (courseId) => {
    try {
      const token = await getToken();
      const { data } = await axios.get(backendUrl + "/api/course/" + courseId, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (data.success) {
        setChapters(data.courseData.courseContent);
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

  const selectCourse = async (course) => {
    setSelectedCourse(course._id);
    await fetchCourseData(course._id);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (codeType != "full" && !selectedChapter) {
      return toast.error("Please Select Chapter");
    } else if (codeType == "lecture" && !selectedLecture) {
      return toast.error("Please Select Lecture");
    }

    try {
      let reqBody = {
        type: codeType,
        courseId: selectedCourse,
      };

      if (codeType !== "full") {
        reqBody.chapterId = selectedChapter;
        if (codeType === "lecture") {
          reqBody.lectureId = selectedLecture;
        }
      }

      const token = await getToken();
      const { data } = await axios.post(
        backendUrl + "/api/promo-code/generate",
        reqBody,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (data.success) {
        toast.success("Code Generated Successfully");
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

  useEffect(() => {
    fetchEducatorCourses();
  }, []);

  useEffect(() => {
    if (codeType == "full") {
      setChapters(null);
      setLactures(null);
      setSelectedChapter(null);
      setSelectedLecture(null);
    } else if (codeType == "chapter") {
      setLactures(null);
      setSelectedLecture(null);
    } else if (codeType == "lecture" && chapters && selectedChapter) {
      setLactures(
        chapters.filter((chapter) => chapter.chapterId == selectedChapter)[0]
          .chapterContent
      );
    }
  }, [codeType, chapters, selectedChapter]);

  return courses ? (
    <div className="h-screen overflow flex flex-col items-start justify-between md:p-8 md:pb-0 p-4 pt-8 pb-0">
      <form
        onSubmit={handleSubmit}
        className="flex flex-col gap-4 max-w-md w-full text-gray-500"
      >
        <div className="flex flex-col gap-1">
          <p>Code Type</p>
          <select
            className="outline-none md:py-2.5 py-2 px-3 rounded border border-gray-500"
            onChange={(e) => setCodeType(e.target.value)}
          >
            <option value="full">Full Course</option>
            <option value="chapter">Chapter Of Course</option>
            <option value="lecture">Lecture Of Course</option>
          </select>
        </div>

        <div className="flex flex-col items-center max-w-4xl w-full overflow-hidden rounded-md bg-white border border-gray-500/20">
          <div className="md:table-auto table-fixed w-full overflow-hidden text-center">
            <div className="text-gray-900 border-b border-gray-500/20 text-sm">
              <div className="flex items-center justify-around">
                <p className="px-4 py-3 font-semibold truncate">Course</p>
                <p className="px-4 py-3 font-semibold truncate">Price</p>
              </div>
            </div>
            <div>
              {courses.map((course) => (
                <label
                  key={course._id}
                  htmlFor={course._id}
                  className={`border-b border-gray-500/20 flex items-center justify-between ${
                    selectedCourse == course._id ? "bg-blue-300/50" : ""
                  }`}
                  onClick={() => selectCourse(course)}
                >
                  <div className="md:px-4 pl-2 md:pl-4 py-3 flex items-center space-x-3 truncate">
                    <input type="radio" id={course._id} />
                    <img
                      src={course.courseThumbnail}
                      alt="Course Image"
                      className="w-16"
                    />
                    <span className="truncate hidden md:block">
                      {course.courseTitle}
                    </span>
                  </div>
                  <p className="px-4 py-3 w-1/2">
                    {currency} {course.coursePrice}
                  </p>
                </label>
              ))}
            </div>
          </div>
        </div>
        {codeType != "full" && chapters && (
          <>
            <div className="flex flex-col items-center max-w-4xl w-full overflow-hidden rounded-md bg-white border border-gray-500/20">
              <div className="md:table-auto table-fixed w-full overflow-hidden text-center">
                <div className="text-gray-900 border-b border-gray-500/20 text-sm">
                  <div className="flex items-center justify-around">
                    <p className="px-4 py-3 font-semibold truncate">Chapter</p>
                  </div>
                </div>
                <div>
                  {chapters.map((chapter) => (
                    <label
                      key={chapter.chapterId}
                      htmlFor={chapter.chapterId}
                      className={`border-b border-gray-500/20 flex items-center justify-between ${
                        selectedChapter == chapter.chapterId
                          ? "bg-blue-300/50"
                          : ""
                      }`}
                      onClick={() => setSelectedChapter(chapter.chapterId)}
                    >
                      <div className="md:px-4 pl-2 md:pl-4 py-3 flex items-center space-x-3 truncate">
                        <input type="radio" id={chapter.chapterId} />
                        <span className="truncate hidden md:block">
                          {chapter.chapterTitle}
                        </span>
                      </div>
                    </label>
                  ))}
                </div>
              </div>
            </div>
            {codeType == "lecture" && lectures && (
              <div className="flex flex-col items-center max-w-4xl w-full overflow-hidden rounded-md bg-white border border-gray-500/20">
                <div className="md:table-auto table-fixed w-full overflow-hidden text-center">
                  <div className="text-gray-900 border-b border-gray-500/20 text-sm">
                    <div className="flex items-center justify-around">
                      <p className="px-4 py-3 font-semibold truncate">
                        Lecture
                      </p>
                    </div>
                  </div>
                  <div>
                    {lectures.map((lecture) => (
                      <label
                        key={lecture.lectureId}
                        htmlFor={lecture.lectureId}
                        className={`border-b border-gray-500/20 flex items-center justify-between ${
                          selectedLecture == lecture.lectureId
                            ? "bg-blue-300/50"
                            : ""
                        }`}
                        onClick={() => setSelectedLecture(lecture.lectureId)}
                      >
                        <div className="md:px-4 pl-2 md:pl-4 py-3 flex items-center space-x-3 truncate">
                          <input type="radio" id={lecture.lectureId} />
                          <span className="truncate hidden md:block">
                            {lecture.lectureTitle}
                          </span>
                        </div>
                      </label>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </>
        )}
        <button
          type="submit"
          className="bg-black text-white w-max py-2.5 px-8 rounded my-4 cursor-pointer"
        >
          Generate
        </button>
      </form>
    </div>
  ) : (
    <Loading />
  );
};

export default CreatePromoCode;
