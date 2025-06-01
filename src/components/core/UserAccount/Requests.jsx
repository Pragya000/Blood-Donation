import { useMutation, useQuery } from "@tanstack/react-query";
import { apiConnector } from "../../../services/apiConnector";
import { LIST_REQUESTS, UPDATE_REQUEST_STATUS } from "../../../services/apis";
import { useUser } from "../../../store/useUser";
import RequestCard from "../Request/RequestCard";
import toast from "react-hot-toast";
import { useMemo, useState } from "react";
import Modal from "../../common/Modal";

const fetchRequests = async () => {
  const data = await apiConnector("GET", LIST_REQUESTS);
  return data;
};

export default function Requests() {
  const [fulfillModalOpen, setFulfillModalOpen] = useState(false);
  const [fullFillData, setFullFillData] = useState(null);
  const [userDetailsModalOpen, setUserDetailsModalOpen] = useState(false);
  const [userDetailsData, setUserDetailsData] = useState(null);
  const { user } = useUser();
  const { data, isLoading, isError, error, refetch } = useQuery(
    ["requests"],
    fetchRequests,
    {
      keepPreviousData: true,
      refetchIntervalInBackground: false,
      refetchOnWindowFocus: false,
    }
  );
  const [rating, setRating] = useState(5);
  const [ratingText, setRatingText] = useState("");

  const displayName =
    userDetailsData?.accountType === "Hospital"
      ? userDetailsData?.additionalFields?.hospitalName
      : userDetailsData?.name;

  const cardContent = useMemo(() => {
    return (
      <div className="text-gray-700">
        {userDetailsData?.accountType === "Hospital" ? (
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
        ) : (
          <>
            <p>
              <span className="font-semibold text-gray-800">Blood Group:</span>{" "}
              {userDetailsData?.additionalFields?.bloodType}
              {userDetailsData?.additionalFields?.rhFactor === "Positive"
                ? "+"
                : "-"}
            </p>
            <p>
              <span className="font-semibold text-gray-800">Age:</span>{" "}
              {userDetailsData?.additionalFields?.age}
            </p>
            <p>
              <span className="font-semibold text-gray-800">Gender:</span>{" "}
              {userDetailsData?.additionalFields?.gender}
            </p>
            <p>
              <span className="font-semibold text-gray-800">City:</span>{" "}
              {userDetailsData?.additionalFields?.city}
            </p>
          </>
        )}
      </div>
    );
  }, [userDetailsData]);

  const mutation = useMutation({
    mutationFn: (payload) => {
      return apiConnector(
        "POST",
        UPDATE_REQUEST_STATUS + `/${payload.id}`,
        payload.data
      );
    },
    onSuccess: (data) => {
      if (data?.data?.success) {
        setFulfillModalOpen(false);
        setFullFillData(null);
        toast.success("Request updated successfully!");
        refetch();
      }
    },
    onError: (error) => {
      toast.error(error?.response?.data?.message || "Something went wrong!");
    },
  });

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (isError) {
    return <div>Error: {error?.message || "Something Went Wrong!"}</div>;
  }

  const finalData = data.data.requests;

  const handleFulfill = (request) => {
    if (request.requestType === "Hospital") {
      setFulfillModalOpen(true);
      setFullFillData(request);
    } else {
      mutation.mutate({
        id: request._id,
        data: {
          status: "Fulfilled",
        },
      });
    }
  };

  const handleUserModalOpen = (data) => {
    setUserDetailsData(data);
    setUserDetailsModalOpen(true);
  };

  return (
    <>
      <h4 className="text-xl font-semibold my-4 md:ml-4">
        Manage your Requests
      </h4>
      {finalData && finalData?.length > 0 ? (
        <div className="md:pl-4">
          {finalData.map((request) => (
            <RequestCard
              key={request._id}
              request={request}
              currentUser={user}
              changeMutation={mutation}
              handleFulfill={handleFulfill}
              handleUserModalOpen={handleUserModalOpen}
            />
          ))}
        </div>
      ) : (
        <div className="min-h-[10vh] py-10">
          <p className="font-bold text-lg text-center">No Requests Found</p>
        </div>
      )}
      <Modal
        open={fulfillModalOpen}
        setOpen={setFulfillModalOpen}
        title="Fulfill Request"
        isDisabled={mutation.isLoading}
        submitHandler={() => {
          mutation.mutate({
            id: fullFillData._id,
            data: {
              status: "Fulfilled",
              reviewText: ratingText,
              ratingPoints: rating,
            },
          });
        }}
        btnText="Fulfill"
        onClose={() => {
          setFullFillData(null);
          setRating(5);
          setRatingText("");
        }}
      >
        <div className="p-4">
          <div className="mb-4">
            <label
              htmlFor="rating"
              className="block text-sm font-medium text-gray-700"
            >
              Rating (1-5)
            </label>
            <select
              id="rating"
              value={rating}
              onChange={(e) => setRating(e.target.value)}
              className="mt-1 block w-full p-2 border border-gray-300 rounded"
            >
              {[1, 2, 3, 4, 5].map((value) => (
                <option key={value} value={value}>
                  {value}
                </option>
              ))}
            </select>
          </div>
          <div className="mb-4">
            <label
              htmlFor="ratingText"
              className="block text-sm font-medium text-gray-700"
            >
              Review
            </label>
            <textarea
              id="ratingText"
              value={ratingText}
              onChange={(e) => setRatingText(e.target.value)}
              className="mt-1 block w-full p-2 border border-gray-300 rounded"
              rows="4"
              placeholder="Tell us about your experience..."
            />
          </div>
        </div>
      </Modal>
      <Modal
        open={userDetailsModalOpen}
        setOpen={setUserDetailsModalOpen}
        title="User Details"
        onClose={() => {
          setUserDetailsData(null);
        }}
        hideFooter
      >
        <div className="p-4">
          <div className="border p-3 bg-gray-50 relative">
            <div className="flex items-center gap-x-2 mb-3">
              <img
                src={userDetailsData?.profilePic}
                alt={displayName}
                className="rounded-full h-10 w-10"
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
        </div>
      </Modal>
    </>
  );
}
