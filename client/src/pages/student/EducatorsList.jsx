import { useContext, useEffect, useState } from "react";
import { AppContext } from "../../context/AppContext";
import { useParams } from "react-router-dom";
import SearchBar from "../../components/students/SearchBar";
import Footer from "../../components/students/Footer";
import { assets } from "../../assets/assets";
import EducatorCard from "../../components/students/EducatorCard";

const EducatorsList = () => {
  const { navigate, allEducators } = useContext(AppContext);
  const { input } = useParams();
  const [filteredEducator, setFilteredEducator] = useState([]);

  useEffect(() => {
    if (allEducators && allEducators.length > 0) {
      const tempEducators = allEducators.slice();
      input
        ? setFilteredEducator(
            tempEducators.filter((item) =>
              item.name.toLowerCase().includes(input.toLocaleLowerCase())
            )
          )
        : setFilteredEducator(tempEducators);
    }
  }, [allEducators, input]);

  return (
    <>
      <div className="relative md:px-36 px-8 pt-20 text-left">
        <div className="flex md:flex-row flex-col gap-6 items-start justify-between w-full">
          <div>
            <h1 className="text-4xl font-semibold text-gray-800">
              Educator List
            </h1>
            <p className="text-gray-500">
              <span
                className="text-blue-600 cursor-pointer"
                onClick={() => navigate("/")}
              >
                Home
              </span>{" "}
              / <span>Educator List</span>
            </p>
          </div>
          <SearchBar data={input} page="educator-list" />
        </div>
        {input && (
          <div className="inline-flex items-center gap-4 px-4 py-2 border border-gray-400 mt-8 -mb-8 text-gray-600">
            <p>{input}</p>
            <img
              src={assets.cross_icon}
              alt=""
              className="cursor-pointer"
              onClick={() => navigate("/educator-list")}
            />
          </div>
        )}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 my-16 gap-3 px-2 md:p-0">
          {filteredEducator.map((educator, index) => (
            <EducatorCard key={index} educator={educator} />
          ))}
        </div>
      </div>
      <Footer />
    </>
  );
};

export default EducatorsList;
