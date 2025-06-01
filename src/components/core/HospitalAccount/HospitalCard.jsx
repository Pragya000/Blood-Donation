/* eslint-disable react/prop-types */
import { IoLocationOutline } from "react-icons/io5";
// import { PiShareFatThin } from "react-icons/pi";
import { useUser } from "../../../store/useUser";
// import toast from "react-hot-toast";
import { useMemo } from "react";
import { Link, useLocation } from "react-router-dom";

export default function HospitalCard({user, handleRequest}) {

    const displayName = user?.additionalFields?.hospitalName
    const {user: currentUser} = useUser()
    const location = useLocation()
    const path = location.pathname.split('/')?.[1]
    const currentLocation = path === 'find-hospitals' ? 'find' : path === 'hospital' ? 'hospitals' : ''

    const cardContent = useMemo(() => {
          return (
            <div className="text-gray-700 flex-1 flex flex-col justify-end">
              <div className="flex flex-col flex-1">
              {currentLocation === 'hospitals' ? (
                <p>
                  <span className="font-semibold text-gray-800">Hospital Name:</span>{" "}
                  {user?.additionalFields?.hospitalName}
                </p>
              ) : null}
              <p>
                <span className="font-semibold text-gray-800">Registration:</span>{" "}
                {user?.additionalFields?.registrationNumber}
              </p>
              <p>
                <span className="font-semibold text-gray-800">Address:</span>{" "}
                {user?.additionalFields?.hospitalAddress}
              </p>
              <p>
                <span className="font-semibold text-gray-800">City:</span>{" "}
                {user?.additionalFields?.city}
              </p>
              </div>
              <div className="flex items-center justify-end mt-2">
                {((user?._id !== currentUser?._id) && (currentUser?.accountType !== 'Hospital')) ? 
                  <button disabled={currentUser?.requestedByMe && currentUser?.requestedByMe?.includes(user?._id)} onClick={()=>handleRequest(user)} className="bg-blue-500 text-sm hover:bg-opacity-90 text-white rounded-md px-4 py-1 flex items-center gap-x-2 disabled:bg-opacity-40">
                  {currentUser?.requestedByMe && currentUser?.requestedByMe.includes(user?._id) ? 'Sent!' : 'Request'}
                </button>
                : null
                }
              </div>
            </div>
          );
      }, []);

    return (
        <div className="border p-3 bg-gray-50 relative flex flex-col">
      <div className="flex items-center gap-x-2 mb-3">
      <Link to={`/hospital/${user?._id}`}>
            <img
              src={user?.profilePic}
              alt={displayName}
              className="rounded-full h-10 w-10"
            />
          </Link>
        <div>
            <div className="flex items-center gap-x-1">
            <Link
              className="font-semibold block text-sm truncate max-w-[12rem]"
              to={`/hospital/${user?._id}`}
            >
              {displayName}
            </Link>
            {user?._id === currentUser?._id ? (
              <div className="text-xs font-medium bg-indigo-400 rounded-full text-white max-w-max px-2">
                You
              </div>
            ) : null}
            </div>
        </div>
      </div>
      {cardContent}
      {/* <div className="mt-3 flex items-center gap-x-2 max-w-max ml-auto">
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
          }} title="Share Hospital">
            <PiShareFatThin className="text-blue-500 text-2xl hover:text-blue-400 !stroke-[6px]" />
          </button>
      </div> */}
      {user?.distance?.toString() ? (
        <div className="absolute w-20 aspect-square bg-blue-500 top-0 right-0 rounded-bl-full">
          <div className="flex flex-col items-center justify-center space-y-1 text-white absolute top-3 right-3">
            <IoLocationOutline className="text-xl stroke-2" />
            <p className="text-xs font-medium">{Math.floor(user?.distance / 1000)} km</p>
          </div>
        </div>
      ) : null}
    </div>
    )
}