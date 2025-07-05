import { useContext } from "react";
import { AppContext } from "../../context/AppContext";
import axios from "axios";
import { toast } from "react-toastify";
import { useEffect } from "react";
import { useState } from "react";
import Loading from "../../components/students/Loading";
import { Link } from "react-router-dom";

const PromoCodes = () => {
  const { backendUrl, getToken } = useContext(AppContext);

  const [promoCodes, setPromoCodes] = useState(null);

  const fetchAllCodes = async () => {
    try {
      const token = await getToken();
      const { data } = await axios.get(backendUrl + "/api/promo-code/all", {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (data.success) {
        setPromoCodes(data.promoCodes);
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

  console.log(promoCodes);

  useEffect(() => {
    fetchAllCodes();
  }, []);

  return promoCodes ? (
    <div className="min-h-screen flex flex-col-reverse 2xl:flex-row justify-end 2xl:justify-start items-start gap-8 md:p-8 md:pb-0 p-4 pt-8 pb-0">
      <div className="flex flex-col items-center max-w-4xl w-full overflow-hidden rounded-md bg-white border border-gray-500/20">
        <table className="table-fixed md:table-auto w-full overflow-hidden pb-4">
          <thead className="text-gray-900 border-b border-gray-500/20 text-sm text-left">
            <tr>
              <th className="px-4 py-3 font-semibold text-center hidden sm:table-cell">
                #
              </th>
              <th className="px-4 py-3 font-semibold">Code</th>
              <th className="px-4 py-3 font-semibold">Created At</th>
              <th className="px-4 py-3 font-semibold">Used</th>
              {/* <th className="px-4 py-3 font-semibold">Download</th> */}
            </tr>
          </thead>
          <tbody className="text-sm text-gray-500">
            {promoCodes.map((code, index) => (
              <tr key={index} className="border-b border-gray-500/20">
                <td className="px-4 py-3 text-center hidden sm:table-cell">
                  {index + 1}
                </td>
                <td className="md:px-4 px-2 py-3 flex items-center space-x-3">
                  <span className="truncate">{code.code}</span>
                </td>
                <td className="px-4 py-3 truncate">{code.createdAt}</td>
                <td className="px-4 py-3 truncate">
                  {code.used ? "Used" : "Unused"}
                </td>
                {/* <td className="px-4 py-3 truncate">{code.used}</td> */}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <Link
        to="/educator/create-promo-code"
        className="py-2 px-4 bg-blue-600 mt-1.5 text-white rounded cursor-pointer"
      >
        Generate New Code
      </Link>
    </div>
  ) : (
    <Loading />
  );
};

export default PromoCodes;
