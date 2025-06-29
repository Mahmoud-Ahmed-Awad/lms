import { useContext, useEffect, useState } from "react";
import { AppContext } from "../../context/AppContext";
import { useParams } from "react-router-dom";
import SearchBar from "../../components/students/SearchBar";
import CourseCard from "../../components/students/CourseCard";
import Footer from "../../components/students/Footer";
import { assets } from "../../assets/assets";
import axios from "axios";
import { toast } from "react-toastify";

const CoursesList = () => {
  const { navigate, allCourses, backendUrl } = useContext(AppContext);
  const { input, category } = useParams();
  const [courses, setCourses] = useState();
  const [filteredCourse, setFilteredCourse] = useState([]);

  const fetchCategoryCourses = async () => {
    try {
      const { data } = await axios.get(
        backendUrl + "/api/category/" + category
      );
      if (data.success) {
        setCourses(data.courses);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
if (error.response?.data?.message) {
        toast.error(error.response.data.message);
      } else {
        toast.error(error.message);
      }    }
  };

  useEffect(() => {
    if (courses && courses.length > 0) {
      const tempCourses = courses.slice();
      input
        ? setFilteredCourse(
            tempCourses.filter((item) =>
              item.courseTitle.toLowerCase().includes(input.toLocaleLowerCase())
            )
          )
        : setFilteredCourse(tempCourses);
    }
  }, [courses, input]);

  useEffect(() => {
    if (category) {
      fetchCategoryCourses();
    } else {
      setCourses(allCourses);
    }
  }, [allCourses, category]);

  return (
    <>
      <div className="relative md:px-36 px-8 pt-20 text-left">
        <div className="flex md:flex-row flex-col gap-6 items-start justify-between w-full">
          <div>
            <h1 className="text-4xl font-semibold text-gray-800">
              Course List
            </h1>
            <p className="text-gray-500">
              <span
                className="text-blue-600 cursor-pointer"
                onClick={() => navigate("/")}
              >
                Home
              </span>{" "}
              / <span>Course List</span>
            </p>
          </div>
          <SearchBar data={input} />
        </div>
        {input && (
          <div className="inline-flex items-center gap-4 px-4 py-2 border border-gray-400 mt-8 -mb-8 text-gray-600">
            <p>{input}</p>
            <img
              src={assets.cross_icon}
              alt=""
              className="cursor-pointer"
              onClick={() => navigate("/course-list")}
            />
          </div>
        )}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 my-16 gap-3 px-2 md:p-0">
          {filteredCourse.map((course, index) => (
            <CourseCard key={index} course={course} />
          ))}
        </div>
      </div>
      <Footer />
    </>
  );
};

export default CoursesList;
