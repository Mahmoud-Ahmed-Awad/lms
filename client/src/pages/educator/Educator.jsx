import { Outlet } from "react-router-dom";
import Navbar from "../../components/educator/Navbar";
import Sidebar from "../../components/educator/Sidebar";
import Footer from "../../components/educator/Footer";
import { useContext, useEffect } from "react";
import { AppContext } from "../../context/AppContext";
import Loading from "../../components/students/Loading";

const Educator = () => {
  const { isEducator, navigate } = useContext(AppContext);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (!isEducator) {
        navigate("/");
      }
    }, 1000);
    return clearTimeout(timer);
  }, [isEducator]);
  return isEducator ? (
    <div className="">
      <Navbar />
      <div className="flex">
        <Sidebar />
        <div className="flex-1">
          <Outlet />
        </div>
      </div>
      <Footer />
    </div>
  ) : (
    <Loading />
  );
};

export default Educator;
