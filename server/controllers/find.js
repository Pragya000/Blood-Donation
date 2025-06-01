/* eslint-disable no-undef */
import User from "../model/User.js";
import _ from "lodash";
import { decryptData } from "../utils/decodeEncode.js";
import { calculateAge } from "../utils/calculateAge.js";
const MONGO_FIELD_KEY = process.env.MONGO_FIELD_ENCRYPTION_SECRET;
import geolib from 'geolib';

// @desc    Function to get pipeline for aggregation
const getPipeline = (
  userLocationCoordinates,
  maxDistanceInMeters,
  type,
  page,
  limit,
  userId
) => {
  let queryPipeline = [];

  if (maxDistanceInMeters) {
    queryPipeline.push({
      $geoNear: {
        near: {
          type: "Point",
          coordinates: userLocationCoordinates,
        },
        distanceField: "distance",
        maxDistance: parseInt(maxDistanceInMeters),
        spherical: true,
      },
    });
    queryPipeline.push({
      $match: {
        _id: {
          $ne: userId,
        },
        approvalStatus: "Approved"
      }
    })
    queryPipeline.push({
      $sort: {
        distance: 1,
        createdAt: -1,
      },
    });
  } else {
    queryPipeline.push({
      $match: {
        _id: {
          $ne: userId,
          },
        approvalStatus: "Approved"
      }
    })
    queryPipeline.push({
      $sort: {
        createdAt: -1,
      },
    });
  }

  let project = {
    _id: 1,
    name: 1,
    profilePic: 1,
    distance: 1,
    createdAt: 1,
    updatedAt: 1,
  }

  if (type === "Hospital") {
    project = {
        ...project,
        "additionalFields.hospitalName": 1,
        "additionalFields.hospitalAddress": 1,
        "additionalFields.registrationNumber": 1,
        "additionalFields.city": 1
    }
  } else {
    project = {
        ...project,
        "additionalFields.bloodType": 1,
        "additionalFields.rhFactor": 1,
        "additionalFields.city": 1,
        "additionalFields.gender": 1,
        "additionalFields.dateOfBirth": 1,
    }
  }

  const rest = [
    {
      $match: {
        accountType: type,
      },
    },
    {
      $skip: parseInt(page) * parseInt(limit),
    },
    {
      $limit: parseInt(limit),
    },
    {
        $project: project
    }
  ];

  queryPipeline.push(...rest);

  return queryPipeline;
};

// @desc    Find donors
// @route   POST /api/find/donors
// @access  Private
export const findDonors = async (req, res) => {
  try {
    const { maxDistanceInMeters, page = 0, limit = 12 } = req.query;
    const user = req.user;

    const userLocationCoordinates = user.additionalFields.location.coordinates;

    const queryPipeline = getPipeline(
      userLocationCoordinates,
      maxDistanceInMeters,
      "User",
      page,
      limit,
      user._id
    );

    const donors = await User.aggregate(queryPipeline);

    const decryptedDonors = donors.map((donor) => {
      const donorCopy = _.cloneDeep(donor);
      donorCopy.additionalFields = {
        bloodType: decryptData(donor.additionalFields.bloodType, MONGO_FIELD_KEY),
        rhFactor: decryptData(donor.additionalFields.rhFactor, MONGO_FIELD_KEY),
        age: calculateAge(decryptData(donor.additionalFields.dateOfBirth, MONGO_FIELD_KEY)),
        gender: donor.additionalFields.gender,
        city: donor.additionalFields.city,
      }
      return donorCopy;
    })

    const result = {
      success: true,
      donors: decryptedDonors,
    };

    if (parseInt(page) > 0) {
      result.previous = {
        pageNumber: parseInt(page) - 1,
        limit: parseInt(limit),
      };
      result.isPrev = true;
    } else {
      result.previous = {
        page: null,
        limit: null,
      };
      result.isPrev = false;
    }

    if (result.donors.length === parseInt(limit)) {
      result.next = {
        pageNumber: parseInt(page) + 1,
        limit: parseInt(limit),
      };
      result.isNext = true;
    } else {
      result.next = {
        pageNumber: null,
        limit: null,
      };
      result.isNext = false;
    }

    result.rowsPerPage = parseInt(limit);

    res.status(200).json(result);
  } catch (error) {
    console.log("Error in findDonors", error);
    res.status(500).json({
      success: false,
      message: "Something went wrong",
    });
  }
};

// @desc    Find hospitals
// @route   POST /api/find/hospitals
// @access  Private
export const findHospitals = async (req, res) => {
  try {
    const { maxDistanceInMeters, page = 0, limit = 12 } = req.query;
    const user = req.user;

    const userLocationCoordinates = user.additionalFields.location.coordinates;

    const queryPipeline = getPipeline(
      userLocationCoordinates,
      maxDistanceInMeters,
      "Hospital",
      page,
      limit,
      user._id
    );

    const hospitals = await User.aggregate(queryPipeline);

    const result = {
      success: true,
      hospitals: hospitals,
    };

    if (parseInt(page) > 0) {
      result.previous = {
        pageNumber: parseInt(page) - 1,
        limit: parseInt(limit),
      };
      result.isPrev = true;
    } else {
      result.previous = {
        page: null,
        limit: null,
      };
      result.isPrev = false;
    }

    if (result.hospitals.length === parseInt(limit)) {
      result.next = {
        pageNumber: parseInt(page) + 1,
        limit: parseInt(limit),
      };
      result.isNext = true;
    } else {
      result.next = {
        pageNumber: null,
        limit: null,
      };
      result.isNext = false;
    }

    result.rowsPerPage = parseInt(limit);

    res.status(200).json(result);
  } catch (error) {
    console.log("Error in findHospitals", error);
    res.status(500).json({
      success: false,
      message: "Something went wrong",
    });
  }
};

// @desc    Find hospital details
// @route   POST /api/find/hospitals/:hospitalId
// @access  Private
export const findHospitalDetails = async (req, res) => {
  try {
    const { hospitalId } = req.params;
    const user = req.user;

    const hospital = await User.findOne({
      _id: hospitalId,
      accountType: "Hospital",
      approvalStatus: "Approved"
    }).populate({
      path: 'reviews',
      populate: {
        path: 'reviewer',
        select: 'name profilePic'
      },
      select: 'ratingPoints reviewText reviewer'
    })
    .select(
      "additionalFields accountType reviews profilePic approvalStatus reviews _id createdAt updatedAt"
    ).lean();

    if (!hospital) {
      return res.status(404).json({
        success: false,
        message: "Hospital not found",
      });
    }

    const hospitalCopy = _.cloneDeep(hospital);
    hospitalCopy.additionalFields = {
      hospitalName: hospital.additionalFields.hospitalName,
      hospitalAddress: hospital.additionalFields.hospitalAddress,
      registrationNumber: hospital.additionalFields.registrationNumber,
      city: hospital.additionalFields.city,
      hospitalImages: hospital.additionalFields.hospitalImages,
      registrationCertificate: hospital.additionalFields.registrationCertificate,
    }

    const distance = geolib.getDistance(
      {
        latitude: user.additionalFields.location.coordinates[1],
        longitude: user.additionalFields.location.coordinates[0],
      },
      {
        latitude: hospital.additionalFields.location.coordinates[1],
        longitude: hospital.additionalFields.location.coordinates[0],
      },
      0.01
    )

    hospitalCopy.distance = distance;

    res.status(200).json({
      success: true,
      hospital: hospitalCopy,
    });
  } catch (error) {
    console.log("Error in findHospitalDetails", error);
    res.status(500).json({
      success: false,
      message: "Something went wrong",
    });
  }
}