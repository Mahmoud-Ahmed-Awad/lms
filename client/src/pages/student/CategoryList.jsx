import { useContext, useEffect, useState } from "react";
import { AppContext } from "../../context/AppContext";
import { useParams } from "react-router-dom";
import SearchBar from "../../components/students/SearchBar";
import CourseCard from "../../components/students/CourseCard";
import Footer from "../../components/students/Footer";
import { assets } from "../../assets/assets";
import axios from "axios";
import { toast } from "react-toastify";
import CategoryCard from "../../components/students/CategoryCard";

const CategoryList = () => {
  const { navigate, backendUrl } = useContext(AppContext);
  const { educatorId, input } = useParams();
  const [filteredCategories, setFilteredcategories] = useState([]);
  const [educatorData, setEducatorData] = useState({});
  const [categories, setCategories] = useState({});

  const fetchCategories = async () => {
    try {
      const { data } = await axios.get(
        `${backendUrl}/api/category/all/${educatorId}`
      );
      if (data.success) {
        setCategories(data.categories);
        setEducatorData(data.educator);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      if (error.response?.data?.message) {
        toast.error(error.response?.data?.message);
      } else {
        toast.error(error.message);
      }
    }
  };

  useEffect(() => {
    if (categories && categories.length > 0) {
      const tempCategories = categories.slice();
      input
        ? setFilteredcategories(
            tempCategories.filter((item) =>
              item.courseTitle.toLowerCase().includes(input.toLocaleLowerCase())
            )
          )
        : setFilteredcategories(tempCategories);
    }
  }, [input, categories]);

  useEffect(() => {
    fetchCategories();
  }, []);

  return (
    <>
      <div className="relative md:px-36 px-8 pt-20 text-left">
        <div className="flex md:flex-row flex-col gap-6 items-start justify-between w-full">
          <div>
            <h1 className="text-4xl font-semibold text-gray-800">
              {educatorData.name} Category List
            </h1>
            <p className="text-gray-500">
              <span
                className="text-blue-600 cursor-pointer"
                onClick={() => navigate("/")}
              >
                Home
              </span>{" "}
              / <span>Educator List</span> /{" "}
              <span>{educatorData ? educatorData.name : ""}</span>
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
          {filteredCategories.map((category, index) => (
            <CategoryCard key={index} category={category} />
          ))}
        </div>
      </div>
      <Footer />
    </>
  );
};

export default CategoryList;
