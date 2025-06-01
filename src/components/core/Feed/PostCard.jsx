/* eslint-disable react/prop-types */
import { useMemo } from "react";
import { Link, useLocation } from "react-router-dom";
import { FaUsers, FaClock as CalendarIcon } from "react-icons/fa";
import Chip from "../../common/Chip";
import moment from "moment";
import { IoEyeOutline, IoLocationOutline } from "react-icons/io5";
import { useUser } from "../../../store/useUser";
import { PiShareFatThin } from "react-icons/pi";
import toast from "react-hot-toast";
import { useMutation } from "@tanstack/react-query";
import { apiConnector } from "../../../services/apiConnector";
import { CREATE_REGISTRATION } from "../../../services/apis";

export default function PostCard({ post, handlePostInterest }) {
  const postUserType = post?.user?.accountType;
  const postType = post?.type;
  const displayName =
    postUserType === "User"
      ? post?.user?.name
      : post?.user?.additionalFields?.hospitalName;
  const {user} = useUser()
  const location = useLocation()
  const path = location.pathname.split('/')?.[1]
  const currentLocation = path === 'feed' ? 'feed' : path === 'post' ? 'post' : ''

  const mutation = useMutation({
    mutationFn: () => {
      return apiConnector('POST', CREATE_REGISTRATION + `/${post?._id}`);
    },
    onSuccess: async (data) => {
      if (data?.data?.success) {
        toast.success('Registered Successfully');
        // fake wait for 1.5 sec
        await new Promise((resolve) => setTimeout(resolve, 1500));
        window.location.replace('/profile/registrations')
      }
    },
    onError: (error) => {
      toast.error(error?.response?.data?.message || 'Something went wrong!');
    },
  });

  const postContent = useMemo(() => {
    if (postType === "Request") {
      return (
        <div className="text-gray-700">
          <p>
            <span className="font-semibold text-gray-800">Blood Group:</span>{" "}
            {post?.user?.additionalFields?.bloodType}
            {post?.user?.additionalFields?.rhFactor === "Positive" ? "+" : "-"}
          </p>
          <p>
            <span className="font-semibold text-gray-800">Age:</span>{" "}
            {post?.user?.additionalFields?.age}
          </p>
          <p>
            <span className="font-semibold text-gray-800">Gender:</span>{" "}
            {post?.user?.additionalFields?.gender}
          </p>
          <p>
            <span className="font-semibold text-gray-800">City:</span>{" "}
            {post?.user?.additionalFields?.city}
          </p>
          {post?.additionalInfo ? (
            <p className="font-light">
              <span className="font-semibold text-gray-800">
                Additional Information:
              </span>
              <br />
              <span className="text-sm">{post?.additionalInfo}</span>
            </p>
          ) : null}
          <div className="flex items-center space-x-2 my-4 text-sm font-light">
            <FaUsers className="text-lg" />
            <p>
              <b className="text-gray-800 font-medium">
                {post?.users?.length} Users
              </b>{" "}
              Have Shown Interest
            </p>
          </div>
          <div className="flex items-center justify-between">
            <div className="flex gap-x-2 items-center">
              <Chip text="Request" bgColor="bg-red-400" />
              <Chip
                text={post?.requestStatus}
                bgColor={
                  post?.requestStatus === "Pending"
                    ? "bg-yellow-400"
                    : "bg-green-300"
                }
              />
            </div>
            {((post?.user?._id !== user?._id) && (user?.accountType !== 'Hospital')) ? 
              <button disabled={post?.users?.includes(user?._id) || post?.requestStatus === 'Approved'} onClick={()=>handlePostInterest(post)} className="bg-blue-500 text-sm hover:bg-opacity-90 text-white disabled:bg-opacity-40 rounded-md px-4 py-1 flex items-center gap-x-2">
              {post?.users?.includes(user?._id) ? 'Sent!' : 'Interested'}
            </button>
            : null
            }
          </div>
        </div>
      );
    } else {
      return (
        <div className="text-gray-700">
          <p>
            <span className="font-semibold text-gray-800">Total Seats:</span>{" "}
            {post?.totalSeats}
          </p>
          <p>
            <span className="font-semibold text-gray-800">Date and Time:</span>{" "}
            {new Date(post.timing).toLocaleDateString("en-US", {
              month: "long",
              day: "numeric",
              year: "numeric",
            })}{" "}
            {new Date(post.timing).toLocaleTimeString("en-US", {
              hour: "numeric",
              minute: "numeric",
              hour12: true,
            })}
          </p>
          <p>
            <span className="font-semibold text-gray-800">City:</span>{" "}
            {post?.user?.additionalFields?.city}
          </p>
          <p>
            <span className="font-semibold text-gray-800">Address:</span><br/>{" "}
            <span className="font-light text-sm">{currentLocation === 'post' ? post?.user?.additionalFields?.hospitalAddress :
            post?.user?.additionalFields?.hospitalAddress.length > 72 ? post?.user?.additionalFields?.hospitalAddress.slice(0, 72) + '...' : post?.user?.additionalFields?.hospitalAddress
             }</span>
          </p>
          {post?.additionalInfo ? (
            <p className="font-light">
              <span className="font-semibold text-gray-800">
                Additional Information:
              </span>
              <br />
              <span className="text-sm">{currentLocation === 'post' ? post?.additionalInfo : 
              post?.additionalInfo.length > 72 ? post?.additionalInfo.slice(0, 72) + '...' : post?.additionalInfo
              }</span>
            </p>
          ) : null}
          <div className="flex items-center space-x-2 my-4 text-sm font-light">
            <FaUsers className="text-lg" />
            <p>
              <b className="text-gray-800 font-medium">
                {post?.users?.length} Users
              </b>{" "}
              Have Registered
            </p>
          </div>
          <div className="flex items-center justify-between">
            <div className="flex gap-x-2 items-center">
              <Chip text="Camp" bgColor="bg-blue-400" />
              {/* check by created at and timing whether it has expired or ongoing */}
                <Chip
                    text={
                    new Date(post.timing) > new Date()
                        ? "Ongoing"
                        : "Expired"
                    }
                    bgColor={
                    new Date(post.timing) > new Date()
                        ? "bg-green-300"
                        : "bg-orange-400"
                    }
                />
            </div>
            {
              ((post?.user?._id !== user?._id) && (user?.accountType !== 'Hospital')) ?
              <button onClick={mutation.mutate} disabled={!(new Date(post.timing) > new Date()) || post?.users?.includes(user?._id) || mutation.isLoading} className="bg-blue-500 disabled:bg-opacity-40 text-sm hover:bg-opacity-90 text-white rounded-md px-4 py-1 flex items-center gap-x-2">
              {
                new Date(post.timing) > new Date() ? `${post?.users?.includes(user?._id) ? 'Registered!' : 'Register'}` : "Expired"
              }
            </button> : null
            }
          </div>
        </div>
      );
    }
  }, []);

  return (
    <div className="border p-3 bg-gray-50 relative">
      <div className="flex items-center gap-x-2 mb-3">
        {postUserType === "Hospital" ? (
          <Link to={`/hospital/${post?.user?._id}`}>
            <img
              src={post?.user?.profilePic}
              alt={displayName}
              className="rounded-full h-10 w-10"
            />
          </Link>
        ) : (
          <img
            src={post?.user?.profilePic}
            alt={displayName}
            className="rounded-full h-10 w-10"
          />
        )}
        <div>
          {postUserType === "User" ? (
            <div className="flex items-center gap-x-1">
            <p className="font-semibold text-sm truncate max-w-[12rem]">{displayName}</p>
            {post?.user?._id === user?._id ? (
              <div className="text-xs font-medium bg-indigo-400 rounded-full text-white max-w-max px-2">
                You
              </div>
            ) : null}
            </div>
          ) : (
            <div className="flex items-center gap-x-1">
            <Link
              className="font-semibold block text-sm truncate max-w-[12rem]"
              to={`/hospital/${post?.user?._id}`}
            >
              {displayName}
            </Link>
            {post?.user?._id === user?._id ? (
              <div className="text-xs font-medium bg-indigo-400 rounded-full text-white max-w-max px-2">
                You
              </div>
            ) : null}
            </div>
          )}
          <div className="flex flex-row items-end gap-1 text-xs text-grey-500">
            <CalendarIcon className="h-4 w-4 stroke-grey-500 stroke-2" />
            <p className="text-xs font-light">
              {moment.utc(post?.createdAt).local().startOf("seconds").fromNow()}
            </p>
          </div>
        </div>
      </div>
      {postContent}
      <div className="mt-3 flex items-center gap-x-2 max-w-max ml-auto">
          { currentLocation !== 'post' ?
            <Link to={`/post/${post?._id}`}title="View Post">
                <IoEyeOutline className="text-blue-500 text-2xl hover:text-blue-400 stroke-2" />
          </Link>
          : null
          }
          <button onClick={()=>{
            navigator.clipboard.writeText('https://bloodconnectmain.vercel.app' + `/post/${post?._id}`)
            toast.success("Link Copied",{
              position: 'bottom-right'
            })
          }} title="Share Post">
            <PiShareFatThin className="text-blue-500 text-2xl hover:text-blue-400 !stroke-[6px]" />
          </button>
          </div>
      {post?.distance?.toString() ? (
        <div className="absolute w-20 aspect-square bg-blue-500 top-0 right-0 rounded-bl-full">
          <div className="flex flex-col items-center justify-center space-y-1 text-white absolute top-3 right-3">
            <IoLocationOutline className="text-xl stroke-2" />
            <p className="text-xs font-medium">{Math.floor(post?.distance / 1000)} km</p>
          </div>
        </div>
      ) : null}
    </div>
  );
}
