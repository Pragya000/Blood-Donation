import { useQuery } from "@tanstack/react-query";
import { useNavigate, useParams } from "react-router-dom";
import { FIND_HOSPITALS } from "../services/apis";
import { apiConnector } from "../services/apiConnector";
import HospitalCard from "../components/core/HospitalAccount/HospitalCard";
import { IoArrowBack } from "react-icons/io5";
import { useState } from "react";
import { useRequestMutation } from "../services/mutations/request";
import Modal from "../components/common/Modal";
import Review from "../components/core/HospitalAccount/Review";

const fetchHospitalDetails = async (hospitalId) => {
  const data = await apiConnector("GET", FIND_HOSPITALS + `/${hospitalId}`);
  return data;
};

export default function Hospital() {
  const { hospitalId } = useParams();
  const navigate = useNavigate();
  const [requestModalOpen, setRequestModalOpen] = useState(false);
  const [requestModalData, setRequestModalData] = useState(null);
  const [additionalInfo, setAdditionalInfo] = useState("");

  const { data, isLoading, isError, error } = useQuery(
    ["hospital", hospitalId],
    () => fetchHospitalDetails(hospitalId),
    {
      keepPreviousData: true,
      refetchIntervalInBackground: false,
      refetchOnWindowFocus: false,
    }
  );

  const requestMutation = useRequestMutation({
    payload: {
      requestee: requestModalData?._id,
      additionalInfo: additionalInfo,
    },
    onSuccess: () => {
      location.replace("/profile/requests");
    },
  });

  const handleRequest = (requestee_user) => {
    setRequestModalData(requestee_user);
    setRequestModalOpen(true);
  };

  return (
    <>
      <div className="min-h-[calc(100vh-84px)] w-11/12 max-w-[1200px] mx-auto grid place-content-center relative">
        {isLoading ? (
          <p>Loading...</p>
        ) : isError ? (
          <p>{error.message}</p>
        ) : data?.data?.hospital ? (
          <div className="w-[90vw] max-w-[1200px] mx-auto pb-10">
            <button
              onClick={() => navigate(-1)}
              className="flex items-center gap-x-2 text-sm bg-blue-100 hover:bg-opacity-70 border-blue-500 rounded-lg text-blue-500 font-medium px-3 py-1 max-w-max my-6"
            >
              <IoArrowBack />
              <span>Back</span>
            </button>
            <div className="sm:w-[550px] mb-4">
              <HospitalCard
                user={data?.data?.hospital}
                handleRequest={handleRequest}
              />
            </div>
            <h2 className="font-semibold text-lg my-2">Images</h2>
            <div className="flex flex-wrap gap-4">
              {data?.data?.hospital?.additionalFields
                ?.registrationCertificate ? (
                <img
                  src={
                    data?.data?.hospital?.additionalFields
                      ?.registrationCertificate
                  }
                  alt="Registration Certificate"
                  className="max-w-[250px] max-h-[250px] aspect-square object-cover"
                />
              ) : null}
              {data?.data?.hospital?.additionalFields?.hospitalImages?.length > 0 && data?.data?.hospital?.additionalFields?.hospitalImages?.map(
                (img, idx) => (
                  <img
                    key={idx}
                    src={img}
                    alt={`Hospital Image ${idx + 1}`}
                    className="max-w-[250px] max-h-[250px] aspect-square object-cover"
                  />
                )
              )}
            </div>
            <h2 className="font-semibold text-lg my-2">Reviews</h2>
            {data?.data?.hospital?.reviews?.length > 0
              ? data?.data?.hospital?.reviews?.map((review) => (
                  <Review key={review?._id} review={review} />
                ))
              : null}
          </div>
        ) : (
          <p>Hospital not found</p>
        )}
      </div>
      <Modal
        open={requestModalOpen}
        setOpen={setRequestModalOpen}
        title={"Confirm Request"}
        btnText={requestMutation.isLoading ? "Loading..." : "Confirm"}
        onClose={() => {
          setRequestModalData(null);
          setAdditionalInfo("");
        }}
        submitHandler={requestMutation.mutate}
        isDisabled={requestMutation.isLoading}
      >
        <div className="p-4 text-sm">
          <p>A Request will be made between You and Post Author.</p>
          <p>
            The Request can be tracked from the <b>Dashboard Section</b>.
          </p>
          <p>
            By Confirming, you <b>Allow us</b> to share your Information with
            the post Author.
          </p>
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
  );
}
