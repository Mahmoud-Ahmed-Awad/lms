// import { useContext } from "react";
// import { assets } from "../../assets/assets";
// import { AppContext } from "../../context/AppContext";
import { Link } from "react-router-dom";

const EducatorCard = ({ educator }) => {
  // const { currency, calculateRating } = useContext(AppContext);

  return (
    <Link
      to={"/category-list/" + educator._id}
      onClick={() => scrollTo(0, 0)}
      className="border border-gray-500/30 pb-6 overflow-hidden rounded-lg"
    >
      <img className="w-full" src={educator.imageUrl} alt="" />
      <div className="p-3 text-left">
        <h3 className="text-base font-semibold">{educator.name}</h3>
      </div>
    </Link>
  );
};

export default EducatorCard;
