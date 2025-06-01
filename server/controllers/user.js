/* eslint-disable no-undef */
import User from "../model/User.js";
import { createRequire } from 'node:module';
const require = createRequire(import.meta.url);
import { encryptData } from "../utils/decodeEncode.js";
import { sendUserResponse } from "../utils/user.js";
import { getRandomCoordinates } from "../utils/distance.js";
import Certificate from "../model/Certificate.js";
const cityData = require('../data/indian_cities.json');
const MONGO_FIELD_KEY = process.env.MONGO_FIELD_ENCRYPTION_SECRET;

// @desc   Get User Profile
// route   GET /api/profile/user-details
// access  Private
export const getUserDetails = async (req, res) => {
  const response = sendUserResponse(req.user);

  res.status(200).json({
    success: true,
    message: "User Profile Fetched Successfully",
    data: {
      user: response,
    }
  });
};

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
// * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

// @desc   Create User Details
// route   POST /api/profile/create-user-details
// access  Private
export const createUserDetails = async (req, res) => {
  try {
    const user = req.user;

    if (user?.accountType === 'User') {
      const {
        name,
        dateOfBirth,
        gender,
        bloodType,
        rhFactor,
        cityId,
      } = req.body;

      if (!name || !dateOfBirth || !gender || !bloodType || !rhFactor || !cityId) {
        return res.status(400).json({ success: false, error: "Please provide all the required fields" });
      }

      if (isNaN(new Date(dateOfBirth).getTime())) {
        return res.status(400).json({ success: false, error: "Please provide a valid date of birth" });
      }

      if (gender !== 'Male' && gender !== 'Female' && gender !== 'Other') {
        return res.status(400).json({ success: false, error: "Please provide a valid Gender" });
      }

      if (bloodType !== 'A' && bloodType !== 'B' && bloodType !== 'AB' && bloodType !== 'O') {
        return res.status(400).json({ success: false, error: "Please provide a valid Blood Type" });
      }

      if (rhFactor !== 'Positive' && rhFactor !== 'Negative') {
        return res.status(400).json({ success: false, error: "Please provide a valid Rh Factor" });
      }

      const city = cityData.find(city => city.id === cityId);

      if (!city) {
        return res.status(400).json({ success: false, error: "Please provide a valid City" });
      }

        const city_lat = city?.lat;
        const city_lng = city?.lng;
        const radius = Math.floor(Math.random() * 40) + 5; // Radius in KM
        
        const randomCoordinates = getRandomCoordinates({
            latitude: city_lat,
            longitude: city_lng
        }, radius);

        if(!randomCoordinates || !randomCoordinates?.latitude || !randomCoordinates?.longitude) {
            return res.status(500).json({ success: false, error: "Internal Server Error" });
        }

      const encryptedDOB = encryptData(dateOfBirth, MONGO_FIELD_KEY);
      const encryptedBloodType = encryptData(bloodType, MONGO_FIELD_KEY);
      const encryptedRhFactor = encryptData(rhFactor, MONGO_FIELD_KEY);

      const updatedUser = await User.findOneAndUpdate({ _id: user._id }, {
        name,
        profilePic: `https://ui-avatars.com/api/?size=512&background=FF5757&color=fff&name=${name}`,
        additionalFields: {
          gender,
          dateOfBirth: encryptedDOB,
          bloodType: encryptedBloodType,
          rhFactor: encryptedRhFactor,
          city: city?.city_ascii,
          location: {
            type: "Point",
            coordinates: [randomCoordinates?.longitude, randomCoordinates?.latitude],
          },
        },
        approvalStatus: 'Approved'
      }, {
        new: true
      })

      const response = sendUserResponse(updatedUser);

      return res.status(201).json({
        success: true,
        message: "User Details Created Successfully",
        data: {
          updatedUser: response,
        },
      });
    } else {
      return res.status(400).json({ success: false, error: "Invalid Account Type" });
    }
  } catch (error) {
    console.log(error);
    return res.status(500).json({ success: false, error: "Something went wrong" });
  }
};

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
// * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

// @desc  List Certificates
// route GET /api/profile/list-certificates
// access Private
export const listCertificates = async (req, res) => {
  try {
    const user = req.user;

    if(user?.accountType !== 'User' || user?.approvalStatus !== 'Approved') {
      return res.status(400).json({ success: false, error: "Invalid Account" });
    }

    const allUserCertificates = await Certificate.find({ user: user._id }).sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      message: "User Certificates Fetched Successfully",
        certificates: allUserCertificates,
    });

  } catch (error) {
    console.log(error);
    return res.status(500).json({ success: false, error: "Something went wrong" });
  }
}