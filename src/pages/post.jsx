import { useNavigate, useParams } from "react-router-dom";
import { apiConnector } from "../services/apiConnector";
import { GET_POST_DETAILS } from "../services/apis";
import { useQuery } from "@tanstack/react-query";
import PostCard from "../components/core/Feed/PostCard";
import { IoArrowBack } from "react-icons/io5";
import useCustomTitle from "../hooks/useCustomTitle";
import { useState } from "react";
import { useUser } from "../store/useUser";
import { useRequestMutation } from "../services/mutations/request";
import { isCompatible } from "../data/compatibility";
import toast from "react-hot-toast";
import Modal from "../components/common/Modal";

const fetchPostDetails = async (postId) => {
  const data = await apiConnector("GET", GET_POST_DETAILS + `/${postId}`);
  return data;
};

export default function Post() {

  useCustomTitle("Post | Blood Donation");

  const { postId } = useParams();
  const navigate = useNavigate();
  const [interestConfirmModal, setInterestConfirmModal] = useState(false);
  const [interestPostId, setInterestPostId] = useState(null);
  const { user } = useUser()
  const { data, isLoading, isError, error } = useQuery(
    ["post", postId],
    () => fetchPostDetails(postId),
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
      toast.success("Request Sent Successfully")
      location.replace('/profile/requests')
    }
  })

  const handlePostInterest = (post) => {
    const donorBloodGroup = `${user?.additionalFields?.bloodType}${user?.additionalFields?.rhFactor === "Positive" ? "+" : "-"}`
    const recipientBloodGroup = `${post?.user?.additionalFields?.bloodType}${post?.user?.additionalFields?.rhFactor === "Positive" ? "+" : "-"}`
    const compatible = isCompatible(donorBloodGroup, recipientBloodGroup)

    if (!compatible) {
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
      <div className="min-h-[calc(100vh-84px)] w-11/12 max-w-[1200px] mx-auto grid place-content-center relative">
        {isLoading ? (
          <p>Loading...</p>
        ) : isError ? (
          <p>{error.message}</p>
        ) : data?.data?.post ? (
          <div className="w-[90vw] sm:w-[550px] ">
            <PostCard post={data?.data?.post} handlePostInterest={handlePostInterest} />
          </div>
        ) : (
          <p>Post not found</p>
        )}
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-x-2 text-sm bg-blue-100 hover:bg-opacity-70 border-blue-500 rounded-lg text-blue-500 font-medium px-3 py-1 max-w-max absolute top-4 left-0">
          <IoArrowBack />
          <span>Back to Feed</span>
        </button>
      </div>
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
