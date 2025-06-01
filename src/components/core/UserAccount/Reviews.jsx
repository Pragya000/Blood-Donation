import { useQuery } from "@tanstack/react-query";
import { apiConnector } from "../../../services/apiConnector";
import { GET_HOSPITAL_REVIEWS } from "../../../services/apis";
import Review from "../HospitalAccount/Review";

async function fetchReviews() {
  const data = await apiConnector("GET", GET_HOSPITAL_REVIEWS);
  return data;
}

export default function Reviews() {
  const { data, isLoading, isError, error } = useQuery(
    ["reviews"],
    fetchReviews,
    {
      keepPreviousData: true,
      refetchIntervalInBackground: false,
      refetchOnWindowFocus: false,
    }
  );

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (isError) {
    return <div>Error: {error?.message || "Something Went Wrong!"}</div>;
  }

  return (
    <>
      <div className="pl-4 mt-4 pb-20 overflow-x-hidden">
        <h4 className="text-xl font-semibold my-4 md:ml-4">Your Reviews</h4>
        {data?.data?.reviews && data?.data?.reviews.length > 0 ? (
          data?.data?.reviews.map((review) => (
            <Review key={review?._id} review={review} />
          ))
        ) : (
          <div className="min-h-[10vh] py-20">
            <p className="font-bold text-lg text-center">
              No Reviews Found
            </p>
          </div>
        )}
      </div>
    </>
  );
}
