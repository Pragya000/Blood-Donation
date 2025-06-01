import { useSearchParams } from "react-router-dom";
import useCustomTitle from "../hooks/useCustomTitle";
import { apiConnector } from "../services/apiConnector";
import { FIND_HOSPITALS } from "../services/apis";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import Modal from "../components/common/Modal";
import { CiFilter } from "react-icons/ci";
import { RiPinDistanceLine } from "react-icons/ri";
import HospitalCard from "../components/core/HospitalAccount/HospitalCard";
import { useRequestMutation } from "../services/mutations/request";

const fetchHospitals = async (page = 1, limit = 12, maxDistanceInMeters) => {
  const params = {
    page,
    limit,
  };
  if (maxDistanceInMeters) {
    params.maxDistanceInMeters = maxDistanceInMeters;
  }

  const data = await apiConnector("GET", FIND_HOSPITALS, {}, {}, params);
  return data;
};

export default function FindHospitals() {

  useCustomTitle("Find Hospitals | Blood Donation")

  const [searchParams, setSearchParams] = useSearchParams();
  const [filterModalOpen, setFilterModalOpen] = useState(false);
  const page = Number(searchParams.get("page")) || 0;
  const distance = Number(searchParams.get("distance")) || null;
  const limit = 12;
  const [filterDistance, setFilterDistance] = useState(
    distance ? Number(distance) / 1000 : 0)
  const [requestModalOpen, setRequestModalOpen] = useState(false);
  const [requestModalData, setRequestModalData] = useState(null)
  const [additionalInfo, setAdditionalInfo] = useState("")

  const { data, isLoading, isError, error, isFetching } = useQuery(
    ["donors", page, limit, distance],
    () => fetchHospitals(page, limit, distance),
    {
      keepPreviousData: true,
      refetchIntervalInBackground: false,
      refetchOnWindowFocus: false,
    }
  )

  const requestMutation = useRequestMutation({
    payload: {
      requestee: requestModalData?._id,
      additionalInfo: additionalInfo,
    },
    onSuccess: () => {
      location.replace('/profile/requests')
    }
  })

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [page]);

  const closeFilterModal = () => {
    const oldDistance = Number(searchParams.get("distance")) || 0;
    setFilterDistance(Number(oldDistance) / 1000);
  };

  const applyFilter = () => {
    if (filterDistance === 0) {
      searchParams.delete("distance");
    } else {
      searchParams.set("distance", filterDistance * 1000);
    }

    searchParams.set("page", 0);

    setSearchParams(searchParams);
    setFilterModalOpen(false);
  };

  const handleRequest = (requestee_user) => {
    setRequestModalData(requestee_user)
    setRequestModalOpen(true)
  }

  return (
    <>
      <div>
        <div className="w-11/12 max-w-[1200px] mx-auto py-6 pb-16">
          <div>
            <div className="flex items-center justify-between flex-wrap gap-y-5 space-x-2">
              <button
                onClick={() => {
                  setFilterModalOpen(true);
                }}
                className="flex items-center gap-x-2 bg-blue-100 hover:bg-opacity-70 border-blue-500 rounded-lg text-blue-500 font-medium px-4 py-2 relative"
              >
                <CiFilter className="text-lg stroke-1" />
                <span>Filter</span>
                {(distance && distance > 0) ? (
                  <div className="w-5 h-5 bg-blue-500 rounded-full absolute -top-[0.45rem] -right-[0.45rem]">
                    <span className="text-white text-xs font-medium absolute top-1/2 -translate-y-1/2 left-1/2 -translate-x-1/2">
                      1
                    </span>
                  </div>
                ) : null}
              </button>
              {distance && distance > 0 ? (
                <div className="flex items-center gap-x-2 text-sm bg-blue-100 hover:bg-opacity-70 border-blue-500 rounded-lg text-blue-500 font-medium px-3 py-1">
                  <RiPinDistanceLine className="text-lg stroke-1" />
                  <p>{distance / 1000} Km</p>
                </div>
              ) : null}
            </div>
            {data?.data ? (
              <>
                <div className="grid grid-cols-1 max-w-[400px] mx-auto sm:max-w-[unset] sm:mx-0 md:grid-cols-2 lg:grid-cols-3 gap-4 my-6">
                  {data?.data?.hospitals?.map((user) => (
                    <HospitalCard user={user} handleRequest={handleRequest} key={user?._id} />
                  ))}
                </div>
              </>
            ) : isLoading || isFetching ? (
              <div className="text-center mt-4">Loading Posts ...</div>
            ) : isError ? (
              <div className="text-center mt-4">{error.message}</div>
            ) : null}
          </div>
        </div>
        {!isError ? (
          <div className="fixed bottom-0 inset-x-0 bg-white border-t border-t-gray-300">
            <div className="w-11/12 max-w-[1200px] mx-auto flex items-center gap-x-6 py-4">
              <button
                disabled={!data?.data?.isPrev || isLoading || isFetching}
                className="bg-blue-500 disabled:bg-opacity-40 text-sm hover:bg-opacity-90 text-white rounded-md px-4 py-1 flex items-center"
                onClick={() => {
                  searchParams.set("page", page - 1);
                  setSearchParams(searchParams);
                }}
              >
                Previous
              </button>
              {!isLoading || !isFetching ? (
                <span className="text-gray-700">
                  Page <b>{parseInt(page) + 1}</b>
                </span>
              ) : null}
              <button
                disabled={!data?.data?.isNext || isLoading || isFetching}
                className="bg-blue-500 disabled:bg-opacity-40 text-sm hover:bg-opacity-90 text-white rounded-md px-4 py-1 flex items-center gap-x-2"
                onClick={() => {
                  searchParams.set("page", page + 1);
                  setSearchParams(searchParams);
                }}
              >
                Next
              </button>
            </div>
          </div>
        ) : null}
        <Modal
          open={filterModalOpen}
          setOpen={setFilterModalOpen}
          title={"Filter Hospitals"}
          btnText="Apply"
          onClose={closeFilterModal}
          submitHandler={applyFilter}
        >
          <div className="p-4">
            <div className="flex flex-col gap-2">
              <label htmlFor="points">Distance (between 0Km and 100Km):</label>
              <div className="flex items-center gap-2">
                <input
                  type="range"
                  id="points"
                  value={filterDistance}
                  onChange={(e) => {
                    setFilterDistance(Number(e.target.value));
                  }}
                  name="points"
                  min="0"
                  max="100"
                  step="5"
                  className="w-[300px]"
                />
                <p>{filterDistance} Km</p>
              </div>
            </div>
          </div>
        </Modal>
      </div>
      <Modal
        open={requestModalOpen}
        setOpen={setRequestModalOpen}
        title={"Confirm Request"}
        btnText={requestMutation.isLoading ? "Loading..." : "Confirm"}
        onClose={() => {
          setRequestModalData(null)
          setAdditionalInfo("")
        }}
        submitHandler={requestMutation.mutate}
        isDisabled={requestMutation.isLoading}
      >
        <div className="p-4 text-sm">
          <p>A Request will be made between You and Post Author.</p>
          <p>The Request can be tracked from the <b>Dashboard Section</b>.</p>
          <p>By Confirming, you <b>Allow us</b> to share your Information with the post Author.</p>
          <p className="mt-2">Additional Information:</p>
          <textarea
            className="w-full h-24 p-2 border border-gray-300 rounded-md"
            value={additionalInfo}
            placeholder="Add any additional information here"
            onChange={(e) => setAdditionalInfo(e.target.value)}
          ></textarea>
        </div>
      </Modal>
    </>
  )
}