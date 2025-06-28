import { useContext } from "react";
import { Link } from "react-router-dom";
import { AppContext } from "../../context/AppContext";
import EducatorCard from "./EducatorCard";

const EducatorsSection = () => {
  const { allEducators } = useContext(AppContext);

  return (
    <div className="py-16 md:px-40 px-8">
      <h2 className="text-3xl font-medium text-gray-800">
        Learn from the best
      </h2>
      <p className="text-sm md:text-base text-gray-500 mt-3">
        Discover our top-rated courses across various categories. From coding
        and desgin to <br /> business and wellness, our courses are crafted to
        deliver result.
      </p>

      <div className="grid grid-cols-auto px-4 md:px-0 md:my-16 my-10 gap-4">
        {allEducators.slice(0, 4).map((educator, index) => (
          <EducatorCard key={index} educator={educator} />
        ))}
      </div>

      <Link
        to="/educator-list"
        onClick={() => scrollTo(0, 0)}
        className="text-gray-500 border border-gray-500/30 px-10 py-3 rounded"
      >
        Show All Educators
      </Link>
    </div>
  );
};

export default EducatorsSection;
