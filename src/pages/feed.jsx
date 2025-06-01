import { useQuery } from "@tanstack/react-query";
import useCustomTitle from "../hooks/useCustomTitle";
import { apiConnector } from "../services/apiConnector";
import { GET_POSTS } from "../services/apis";
import { useSearchParams } from "react-router-dom";
import PostCard from "../components/core/Feed/PostCard";
import CreatePostButton from "../components/core/Feed/CreatePostButton";
import { CiFilter } from "react-icons/ci";
import { useEffect, useState } from "react";
import Modal from "../components/common/Modal";
import { IoOptionsOutline } from "react-icons/io5";
import { RiPinDistanceLine } from "react-icons/ri";
import { isCompatible } from "../data/compatibility";
import { useUser } from "../store/useUser";
import toast from "react-hot-toast";
import { useRequestMutation } from "../services/mutations/request";

const fetchPosts = async (page = 1, limit = 12, maxDistanceInMeters, type) => {
  const params = {
    page,
    limit,
  };
  if (maxDistanceInMeters) {
    params.maxDistanceInMeters = maxDistanceInMeters;
  }

  if (type) {
    params.type = type;
  }

  const data = await apiConnector("GET", GET_POSTS, {}, {}, params);
  return data;
};

export default function Feed() {
  useCustomTitle("Feed | Blood Donation");

  const [searchParams, setSearchParams] = useSearchParams();
  const [filterModalOpen, setFilterModalOpen] = useState(false);
  const page = Number(searchParams.get("page")) || 0;
  const distance = Number(searchParams.get("distance")) || null;
  const type = searchParams.get("type") || null;
  const limit = 12;
  const [filterDistance, setFilterDistance] = useState(
    distance ? Number(distance) / 1000 : 0
  );
  const [filterType, setFilterType] = useState(type ? type : "all");
  const [interestConfirmModal, setInterestConfirmModal] = useState(false);
  const [interestPostId, setInterestPostId] = useState(null);
  const {user} = useUser()

  const { data, isLoading, isError, error, isFetching, refetch } = useQuery(
    ["posts", page, limit, distance, type],
    () => fetchPosts(page, limit, distance, type),
    {
      keepPreviousData: true,
      refetchIntervalInBackground: false,
      refetchOnWindowFocus: false,
    }
  );

  const requestMutation = useRequestMutation({
    payload: {
      post: interestPostId
    },
    onSuccess: () => {
      toast.success("Request Sent Successfully", {
        position: 'bottom-right'
      })
      location.replace('/profile/requests')
    }
  })

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [page]);

  const closeFilterModal = () => {
    const oldType = searchParams.get("type") || "all";
    const oldDistance = Number(searchParams.get("distance")) || 0;
    setFilterType(oldType);
    setFilterDistance(Number(oldDistance) / 1000);
  };

  const applyFilter = () => {
    if (filterDistance === 0) {
      searchParams.delete("distance");
    } else {
      searchParams.set("distance", filterDistance * 1000);
    }

    if (filterType === "all") {
      searchParams.delete("type");
    } else {
      searchParams.set("type", filterType);
    }

    searchParams.set("page", 0);

    setSearchParams(searchParams);
    setFilterModalOpen(false);
  };

  const handlePostInterest = (post) => {
    const donorBloodGroup = `${user?.additionalFields?.bloodType}${user?.additionalFields?.rhFactor === "Positive" ? "+" : "-"}`
    const recipientBloodGroup = `${post?.user?.additionalFields?.bloodType}${post?.user?.additionalFields?.rhFactor === "Positive" ? "+" : "-"}`
    const compatible = isCompatible(donorBloodGroup, recipientBloodGroup)

    if(!compatible) {
      toast.error("Incompatible Blood Groups", {
        position: 'bottom-right'
      })
      return
    }

    setInterestPostId(post._id);
    setInterestConfirmModal(true);
  }

  return (
    <>
      <div className="w-11/12 max-w-[1200px] mx-auto py-6 pb-16">
        <div className="flex items-center justify-between gap-x-2 gap-y-5 flex-wrap">
          <CreatePostButton refetch={refetch} />
          <div>
            <button
              onClick={() => {
                setFilterModalOpen(true);
              }}
              className="flex items-center gap-x-2 bg-blue-100 hover:bg-opacity-70 border-blue-500 rounded-lg text-blue-500 font-medium px-4 py-2 relative"
            >
              <CiFilter className="text-lg stroke-1" />
              <span>Filter</span>
              {(distance && distance > 0) || (type && type !== "all") ? (
                <div className="w-5 h-5 bg-blue-500 rounded-full absolute -top-[0.45rem] -right-[0.45rem]">
                  <span className="text-white text-xs font-medium absolute top-1/2 -translate-y-1/2 left-1/2 -translate-x-1/2">
                    {distance && distance > 0 && type && type !== "all" ? 2 : 1}
                  </span>
                </div>
              ) : null}
            </button>
          </div>
        </div>
        {(distance && distance > 0) || (type && type !== "all") ? (
          <div className="flex mt-5 gap-2 flex-wrap">
            {distance && distance > 0 ? (
              <div className="flex items-center gap-x-2 text-sm bg-blue-100 hover:bg-opacity-70 border-blue-500 rounded-lg text-blue-500 font-medium px-3 py-1">
                <RiPinDistanceLine className="text-lg stroke-1" />
                <p>{distance / 1000} Km</p>
              </div>
            ) : null}
            {type && type !== "all" ? (
              <div className="flex items-center gap-x-2 text-sm bg-blue-100 hover:bg-opacity-70 border-blue-500 rounded-lg text-blue-500 font-medium px-3 py-1">
                <IoOptionsOutline className="text-lg stroke-1" />
                <p>{type.charAt(0).toUpperCase() + type.slice(1)}</p>
              </div>
            ) : null}
          </div>
        ) : null}
        {data?.data ? (
          <>
            <div className="grid grid-cols-1 max-w-[400px] mx-auto sm:max-w-[unset] sm:mx-0 md:grid-cols-2 lg:grid-cols-3 gap-4 my-6">
              {data?.data?.posts?.map((post) => (
                <PostCard post={post} handlePostInterest={handlePostInterest} key={post?._id} />
              ))}
            </div>
          </>
        ) : isLoading || isFetching ? (
          <div className="text-center mt-4">Loading Posts ...</div>
        ) : isError ? (
          <div className="text-center mt-4">{error.message}</div>
        ) : null}
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
        title={"Filter Posts"}
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
          <div>
            <p>Type:</p>
            <div className="flex items-center gap-x-4">
              <div className="flex items-center gap-x-1">
                <input
                  type="radio"
                  id="all"
                  name="type"
                  value="all"
                  checked={filterType === "all"}
                  onChange={(e) => setFilterType(e.target.value)}
                />
                <label htmlFor="all">All</label>
              </div>
              <div className="flex items-center gap-x-1">
                <input
                  type="radio"
                  id="request"
                  name="type"
                  value="request"
                  checked={filterType === "request"}
                  onChange={(e) => setFilterType(e.target.value)}
                />
                <label htmlFor="request">Request</label>
              </div>
              <div className="flex items-center gap-x-1">
                <input
                  type="radio"
                  id="camp"
                  name="type"
                  value="camp"
                  checked={filterType === "camp"}
                  onChange={(e) => setFilterType(e.target.value)}
                />
                <label htmlFor="camp">Camp</label>
              </div>
            </div>
          </div>
        </div>
      </Modal>
      <Modal
        open={interestConfirmModal}
        setOpen={setInterestConfirmModal}
        title={"Confirm Interest"}
        btnText={requestMutation.isLoading ? "Loading..." : "Confirm"}
        onClose={() => setInterestPostId(null)}
        submitHandler={requestMutation.mutate}
        isDisabled={requestMutation.isLoading}
      >
        <div className="p-4 text-sm">
          <p>A Request will be made between You and Post Author.</p>
          <p>The Request can be tracked from the <b>Dashboard Section</b>.</p>
          <p>By Confirming, you <b>Allow us</b> to share your Information with the post Author.</p>
        </div>
      </Modal>
    </>
  );
}
