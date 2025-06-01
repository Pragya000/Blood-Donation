import { useMemo } from "react";
import { useUser } from "../../../store/useUser";
import moment from "moment";

export default function BasicDetails() {
  const { user } = useUser();

  const displayName =
    user?.accountType === "Hospital"
      ? user?.additionalFields?.hospitalName
      : user?.name;

  const cardContent = useMemo(() => {
    return (
      <div className="text-gray-700">
        {user?.accountType === "User" ? (
          <>
            <p>
              <span className="font-semibold text-gray-800">Blood Group:</span>{" "}
              {user?.additionalFields?.bloodType}
              {user?.additionalFields?.rhFactor === "Positive" ? "+" : "-"}
            </p>
            <p>
              <span className="font-semibold text-gray-800">
                Date Of Birth:
              </span>{" "}
              {moment(user?.additionalFields?.dateOfBirth).format("DD/MM/YYYY")}
            </p>
            <p>
              <span className="font-semibold text-gray-800">Gender:</span>{" "}
              {user?.additionalFields?.gender}
            </p>
            <p>
              <span className="font-semibold text-gray-800">City:</span>{" "}
              {user?.additionalFields?.city}
            </p>
          </>
        ) : (
          <>
            <p>
              <span className="font-semibold text-gray-800">
                Hospital Name:
              </span>{" "}
              {user?.additionalFields?.hospitalName}
            </p>
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
          </>
        )}
      </div>
    );
  }, []);

  const renderUserDetails = () => {
    return (
      <div className="border p-3 bg-gray-50 relative min-w-[300px]">
        <div className="flex flex-col items-center gap-x-2 mb-3">
          <img
            src={user?.profilePic}
            alt={displayName}
            className="rounded-full h-16 w-16"
          />
          <div>
            <div className="flex items-center gap-x-1">
              <p className="font-semibold text-sm truncate max-w-[12rem]">
                {displayName}
              </p>
            </div>
          </div>
        </div>
        {cardContent}
      </div>
    );
  };

  return (
    <>
      <div className="min-h-[80vh] grid place-content-center">
        {renderUserDetails()}
      </div>
    </>
  );
}
