import mongoose from "mongoose";
import short from "short-uuid";

const CertificateSchema = new mongoose.Schema(
  {
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
    },
    request: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Request",
    },
    registration: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Registration",
    },
    cert_id: {
        type: String,
        default: short.generate(),
    },
    reason: {
        type: String,
        enum: ['Donation', 'Donation Camp']
    },
  },
  {
    timestamps: true,
  }
);

const Certificate = mongoose.model("Certificate", CertificateSchema);

export default Certificate;