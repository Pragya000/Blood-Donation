import mongoose from "mongoose";

const RequestSchema = new mongoose.Schema(
  {
    requestee: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
    },
    requester: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        validate: {
            validator: async function(v) {
                const user = await mongoose.model("User").findById(v);
                return user.accountType === "User";
            },
            message: "Requester must be a User"
        }
    },
    status: {
        type: String,
        enum: ["Requested", "Rejected", "Accepted", 'Fulfilled'],
        default: "Requested",
    },
    post: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Post",
    },
    additionalInfo: {
        type: String,
        validate: {
            validator: function(v) {
                return v.length <= 1000;
            },
            message: props => `${props.value} exceeds 1000 characters`
        }
    },
    requestType: {
        type: String,
        enum: ['Post', 'User', 'Hospital']
    }
  },
  {
    timestamps: true,
  }
);

const Request = mongoose.model("Request", RequestSchema);

export default Request;
