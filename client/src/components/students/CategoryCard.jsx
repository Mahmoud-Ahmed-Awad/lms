// import { useContext } from "react";
// import { assets } from "../../assets/assets";
// import { AppContext } from "../../context/AppContext";
import { Link } from "react-router-dom";

const CategoryCard = ({ category }) => {
  // const { currency, calculateRating } = useContext(AppContext);

  return (
    <Link
      to={"/category-course-list/" + category._id}
      onClick={() => scrollTo(0, 0)}
      className="border border-gray-500/30 pb-6 overflow-hidden rounded-lg max-w-[]"
    >
      <img className="w-full" src={category.thumbnail} alt="" />
      <div className="p-3 text-left">
        <h3 className="text-base font-semibold">{category.name}</h3>
      </div>
    </Link>
  );
};

export default CategoryCard;
