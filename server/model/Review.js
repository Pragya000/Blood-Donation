import mongoose from "mongoose";

const ReviewSchema = new mongoose.Schema(
  {
    reviewee: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      validate: {
        validator: async function(v) {
            const user = await mongoose.model("User").findById(v);
            return user.accountType === "Hospital";
        },
        message: `Reviewee must be a Hospital`
      }
    },
    reviewer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      validate: {
        validator: async function(v) {
            const user = await mongoose.model("User").findById(v);
            return user.accountType === "User";
        },
        message: `Reviewer must be a User`
      }
    },
    ratingPoints: {
      type: Number,
      required: true,
      min: 1,
      max: 5
    },
    reviewText: {
      type: String,
      required: true,
      validate: {
        validator: function(v) {
          return v.length <= 1000;
        },
        message: `Review exceeds 1000 characters`
      }
    },
  },
  {
    timestamps: true,
  }
);

const Review = mongoose.model("Review", ReviewSchema);

export default Review;
