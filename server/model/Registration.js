import mongoose from "mongoose";

const RegistrationSchema = new mongoose.Schema(
  {
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        validate: {
            validator: async function(v) {
                const user = await mongoose.model("User").findById(v);
                return user.accountType === "User";
            },
            message: "User must be a User"
        }
    },
    hospital: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        validate: {
            validator: async function(v) {
                const hospital = await mongoose.model("User").findById(v);
                return hospital.accountType === "Hospital";
            },
            message: "Hospital must be a Hospital"
        }
    },
    status: {
        type: String,
        enum: ["Registered", 'Fulfilled'],
    },
    post: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Post"
    }
  },
  {
    timestamps: true,
  }
);

const Registration = mongoose.model("Registration", RegistrationSchema);

export default Registration;
