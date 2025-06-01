/* eslint-disable react/prop-types */
import StarRatings from "react-star-ratings";

export default function Review({ review }) {
  return (
    <div key={review?._id} className="bg-gray-50 border p-4 max-w-[350px]">
      <div className="flex items-center justify-start gap-x-2">
        <img
          src={review?.reviewer?.profilePic}
          alt="profile"
          className="w-8 h-8 rounded-full"
        />
        <p className="text-sm font-semibold">{review?.reviewer?.name}</p>
      </div>
      <div className="mt-3">
        <StarRatings
          rating={review?.ratingPoints ? review?.ratingPoints : 0}
          starRatedColor="#FFD700"
          numberOfStars={5}
          starDimension="20px"
          starSpacing="3px"
        />
        {review?.reviewText ? (
          <div className="text-sm break-words break-all mt-2">
            {review?.reviewText}
          </div>
        ) : null}
      </div>
    </div>
  );
}
