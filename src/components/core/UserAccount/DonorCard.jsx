/* eslint-disable react/prop-types */
import { IoLocationOutline } from "react-icons/io5";
// import { PiShareFatThin } from "react-icons/pi";
import { useUser } from "../../../store/useUser";
// import toast from "react-hot-toast";
import { useMemo } from "react";

export default function DonorCard({user, handleRequest}) {

    const displayName = user?.name
    const {user: currentUser} = useUser()

    const cardContent = useMemo(() => {
          return (
            <div className="text-gray-700">
              <p>
                <span className="font-semibold text-gray-800">Blood Group:</span>{" "}
                {user?.additionalFields?.bloodType}
                {user?.additionalFields?.rhFactor === "Positive" ? "+" : "-"}
              </p>
              <p>
                <span className="font-semibold text-gray-800">Age:</span>{" "}
                {user?.additionalFields?.age}
              </p>
              <p>
                <span className="font-semibold text-gray-800">Gender:</span>{" "}
                {user?.additionalFields?.gender}
              </p>
              <p>
                <span className="font-semibold text-gray-800">City:</span>{" "}
                {user?.additionalFields?.city}
              </p>
              <div className="flex items-center justify-end mt-2">
                {((user?._id !== currentUser?._id) && (currentUser?.accountType !== 'Hospital')) ? 
                  <button disabled={currentUser?.requestedByMe && currentUser?.requestedByMe?.includes(user?._id)} onClick={()=>handleRequest(user)} className="bg-blue-500 text-sm hover:bg-opacity-90 text-white disabled:bg-opacity-40 rounded-md px-4 py-1 flex items-center gap-x-2">
                  {(currentUser?.requestedByMe && currentUser?.requestedByMe?.includes(user?._id)) ? 'Sent!' : 'Request'}
                </button>
                : null
                }
              </div>
            </div>
          );
      }, []);

    return (
        <div className="border p-3 bg-gray-50 relative">
      <div className="flex items-center gap-x-2 mb-3">
          <img
            src={user?.profilePic}
            alt={displayName}
            className="rounded-full h-10 w-10"
          />
        <div>
            <div className="flex items-center gap-x-1">
            <p className="font-semibold text-sm truncate max-w-[12rem]">{displayName}</p>
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
          }} title="Share Post">
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