import { useQuery } from "@tanstack/react-query";
import { apiConnector } from "../../../services/apiConnector";
import { GET_ADMIN_STATS } from "../../../services/apis";
import moment from "moment";

const fetchStats = async () => {
  const data = await apiConnector("GET", GET_ADMIN_STATS);
  return data;
};

export default function AdminHome() {
  const { data, isLoading, isError, error } = useQuery(["stats"], fetchStats, {
    keepPreviousData: true,
    refetchIntervalInBackground: false,
    refetchOnWindowFocus: false,
  });

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (isError || !data?.data?.data) {
    return <div>Error: {error.message || "Something Went Wrong!"}</div>;
  }

  const finalData = data.data.data;
  const startOfWeek = moment().startOf("isoWeek").toDate();
  const endOfWeek = moment().endOf("isoWeek").toDate();
  const startOfMonth = moment().startOf("month").toDate();
  const endOfMonth = moment().endOf("month").toDate();

  return (
    <div className="container mx-auto mt-4">
      <h3 className="font-semibold text-2xl mb-6">Welcome, Admin</h3>
      <h4 className="sm:text-xl font-bold mb-4">Users Statistics</h4>
      <div className="flex flex-col md:flex-row gap-4 flex-wrap">
        <div className="border-2 p-4 bg-white flex-1 flex flex-col justify-between">
          <p className="text-sm text-gray-500">Total Users</p>
          <p className="text-3xl font-bold">{finalData?.userCount}</p>
        </div>
        <div className="border-2 p-4 bg-white flex-1 flex flex-col justify-between">
          <p className="text-sm text-gray-500">
            Last Week{" "}
            <span className="text-xs font-medium">
              ({moment(startOfWeek).format("DD/MM")}-
              {moment(endOfWeek).format("DD/MM")})
            </span>
          </p>
          <p className="text-3xl font-bold">{finalData?.usersLastWeek}</p>
        </div>
        <div className="border-2 p-4 bg-white flex-1 flex flex-col justify-between">
          <p className="text-sm text-gray-500">
            Last Month{" "}
            <span className="text-xs font-medium">
              ({moment(startOfMonth).format("DD/MM")}-
              {moment(endOfMonth).format("DD/MM")})
            </span>
          </p>
          <p className="text-3xl font-bold">{finalData?.usersLastMonth}</p>
        </div>
      </div>

      <h4 className="sm:text-xl font-bold mt-8 mb-4">Hospitals Statistics</h4>
      <div className="flex flex-col md:flex-row gap-4 flex-wrap">
        <div className="border-2 p-4 bg-white flex-1 flex flex-col justify-between">
          <p className="text-sm text-gray-500">Total Hospitals</p>
          <p className="text-3xl font-bold">{finalData?.hospitalCount}</p>
        </div>
        <div className="border-2 p-4 bg-white flex-1 flex flex-col justify-between">
          <p className="text-sm text-gray-500">
            Last Week{" "}
            <span className="text-xs font-medium">
              ({moment(startOfWeek).format("DD/MM")}-
              {moment(endOfWeek).format("DD/MM")})
            </span>
          </p>
          <p className="text-3xl font-bold">{finalData?.hospitalsLastWeek}</p>
        </div>
        <div className="border-2 p-4 bg-white flex-1 flex flex-col justify-between">
          <p className="text-sm text-gray-500">
            Last Month{" "}
            <span className="text-xs font-medium">
              ({moment(startOfMonth).format("DD/MM")}-
              {moment(endOfMonth).format("DD/MM")})
            </span>
          </p>
          <p className="text-3xl font-bold">{finalData?.hospitalsLastMonth}</p>
        </div>
      </div>
    </div>
  );
}
