import mongoose from "mongoose";

const PostSchema = new mongoose.Schema(
  {
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
    },
    type: {
        type: String,
        enum: ["Request", "Camp"],
    },
    location: {
        type: { type: String, default: "Point" },
        coordinates: { type: [Number], default: [0, 0] },
    },
    timing: {
        type: Date,
    },
    totalSeats: {
        type: Number,
    },
    users: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
        },
    ],
    userCount: {
        type: Number,
    },
    additionalInfo: {
        type: String
    },
    requestStatus: {
        type: String,
        enum: ["Pending", "Approved", "NA"],
    }
  },
  {
    timestamps: true,
  }
);

// Create 2dsphere index on location field
PostSchema.index({ location: '2dsphere' });

const Post = mongoose.model("Post", PostSchema);

export default Post;
