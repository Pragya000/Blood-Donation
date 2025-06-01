import mongoose from "mongoose";

const UserSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      trim: true,
    },
    profilePic: {
      type: String,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true, // trim whitespace
      lowercase: true,
    },
    password: {
      type: String,
      required: true,
    },
    accountType: {
      type: String,
      enum: ["User", "Hospital", "Admin"],
      required: true,
    },
    approvalStatus: {
      type: String,
      enum: ["Started", "Pending", "Approved", "Rejected"],
      default: "Started",
    },
    additionalFields: {
      type: mongoose.Schema.Types.Mixed,
    },
    posts: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: "Post",
    }],
    requestedByMe: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    }],
    requestsFullfilled: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: "Request",
    }],
    campsParticipatedIn: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: "Post",
    }],
    certificates: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: "Certificate",
    }],
    reviews: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: "Review",
    }]
  },
  {
    timestamps: true,
  }
);

const userFields = {
  dateOfBirth: { type: String, default: '' },
  gender: { type: String, default: ''},
  bloodType: { type: String, default: '' },
  rhFactor: { type: String, default: '' },
  city: { type: String, default: '' },
  location: {
    type: { type: String, default: 'Point' },
    coordinates: { type: [Number], default: [0, 0] }
  }
};

const hospitalFields = {
  registrationNumber: { type: String, default: '' },
  registrationCertificate: { type: String, default: '' },
  hospitalImages: [{ type: String }],
  hospitalName: { type: String, default: ''},
  hospitalAddress: { type: String, default: ''},
  city: { type: String, default: '' },
  location: {
    type: { type: String, default: 'Point' },
    coordinates: { type: [Number], default: [0, 0] }
  }
};

UserSchema.pre('findOneAndUpdate', function(next) {
  if (this.accountType === 'User') {
    this.additionalFields = Object.assign({}, this.additionalFields || {}, userFields);
  } else if (this.accountType === 'Hospital') {
    this.additionalFields = Object.assign({}, this.additionalFields || {}, hospitalFields);
  }
  next();
});

// Create 2dsphere index on location field inside additionalDetails
UserSchema.index({ 'additionalFields.location': '2dsphere' });

const User = mongoose.model("User", UserSchema);

export default User;
