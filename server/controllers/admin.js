/* eslint-disable no-undef */
import User from "../model/User.js";
import { createRequire } from 'node:module';
const require = createRequire(import.meta.url);
import { getRandomCoordinates } from "../utils/distance.js";
const cityData = require('../data/indian_cities.json');
import * as crypto from "crypto";
const MONGO_FIELD_KEY = process.env.MONGO_FIELD_ENCRYPTION_SECRET;
import { encryptData } from "../utils/decodeEncode.js";
import mongoose from "mongoose";
import moment from "moment";

// @desc   Get List Hospital Users
// route   GET /api/admin/get-hospitals-list
// access  Private
export const getHospitalsList = async (req, res) => {
  try {
    const { page = 1, limit = 10, approvalStatus } = req.query;
    const query = { accountType: 'Hospital' };

    if (page < 1 || limit < 1) {
      return res.status(400).json({ success: false, error: "Invalid page or limit" });
    }

    if (approvalStatus) {
      query.approvalStatus = approvalStatus;
    }

    const hospitals = await User.find(query)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(parseInt(limit));

    const total = await User.countDocuments(query);

    const updatedHospitals = hospitals.map(hospital => {
      hospital.password = undefined;
      return hospital;
    })

    res.json({
      hospitals: updatedHospitals,
      total,
      page: parseInt(page),
      totalPages: Math.ceil(total / limit),
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ success: false, error: "Something went wrong" });
  }
};

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
// * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

// @desc   Populate Users in DB
// route   POST /api/admin/populate-user
// access  Private
export const populateUser = async (req, res) => {
  try {
    const { type } = req.query

    if (type !== 'user' && type !== 'hospital') {
      return res.status(400).json({ success: false, error: "Invalid type" });
    }

    const { email, cityId } = req.body;

    if (!email) {
      return res.status(400).json({ success: false, error: "Please provide an email" });
    }

    if (!cityId) {
      return res.status(400).json({ success: false, error: "Please provide a cityId" });
    }

    const password = 'Password@123';
    // hash the password
    const hashedPassword = crypto
      .createHmac("sha256", process.env.SECRET)
      .update(password)
      .digest("hex");

    const city = cityData.find(city => city.id === Number(cityId));

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

    if (!randomCoordinates || !randomCoordinates?.latitude || !randomCoordinates?.longitude) {
      return res.status(500).json({ success: false, error: "Internal Server Error" });
    }

    if (type === 'user') {
      const {
        name,
        dateOfBirth,
        gender,
        bloodType,
        rhFactor,
      } = req.body;

      if (!name || !dateOfBirth || !gender || !bloodType || !rhFactor) {
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

      const encryptedDOB = encryptData(dateOfBirth, MONGO_FIELD_KEY);
      const encryptedBloodType = encryptData(bloodType, MONGO_FIELD_KEY);
      const encryptedRhFactor = encryptData(rhFactor, MONGO_FIELD_KEY);

      await User.create({
        name,
        email,
        password: hashedPassword,
        accountType: 'User',
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
      })

      return res.status(201).json({ success: true });

    } else if (type === 'hospital') {
      const { registrationNumber, hospitalName, hospitalAddress, registrationCertificate } = req.body;

      if (!registrationNumber || !hospitalName || !hospitalAddress || !registrationCertificate) {
        return res.status(400).json({ error: 'All required fields must be filled and files must be uploaded' });
      }

      const hospitalImages = [];
      for (let i = 0; i < 3; i++) {
        if (req.body?.[`hospitalImages${i + 1}`]) {
          hospitalImages.push(req.body?.[`hospitalImages${i + 1}`]);
        }
      }

      await User.create({
        email,
        password: hashedPassword,
        accountType: 'Hospital',
        profilePic: `https://ui-avatars.com/api/?size=512&background=FF5757&color=fff&name=${hospitalName}`,
        additionalFields: {
          hospitalName,
          registrationNumber,
          hospitalAddress,
          registrationCertificate,
          hospitalImages,
          city: city?.city_ascii,
          location: {
            type: "Point",
            coordinates: [randomCoordinates?.longitude, randomCoordinates?.latitude],
          },
        },
        approvalStatus: 'Pending'
      })

      return res.status(201).json({ success: true });

    } else {
      return res.status(400).json({ success: false, error: "Invalid type" });
    }


  } catch (error) {
    console.log(error);
    return res.status(500).json({ success: false, error: "Something went wrong" });
  }
};

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
// * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

// @desc  Change Status of Hospital
// route  POST /api/admin/change-hospital-status/:id
// access Private
export const changeHospitalStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { action } = req.body;

    if (!id || !mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ success: false, error: "Please provide a valid id" });
    }

    if (!action || (action !== 'approve' && action !== 'reject')) {
      return res.status(400).json({ success: false, error: "Please provide a valid" });
    }

    const hospital = await User.findById(
      new mongoose.Types.ObjectId(id)
    );

    if (!hospital) {
      return res.status(404).json({ success: false, error: "Hospital not found" });
    }

    const currentHospitalStatus = hospital.approvalStatus;

    if (action === 'approve') {
      if (currentHospitalStatus === 'Pending' || currentHospitalStatus === 'Rejected') {
        hospital.approvalStatus = 'Approved';
      } else {
        return res.status(400).json({ success: false, error: "Invalid action" });
      }
    } else {
      if (currentHospitalStatus === 'Pending' || currentHospitalStatus === 'Approved') {
        hospital.approvalStatus = 'Rejected';
      } else {
        return res.status(400).json({ success: false, error: "Invalid action" });
      }
    }

    await hospital.save();

    res.json({ success: true });

  } catch (error) {
    console.log(error);
    return res.status(500).json({ success: false, error: "Something went wrong" });
  }
};

// @desc  Get Admin Stats
// route  GET /api/admin/stats
// access Private
export const getAdminStats = async (req, res) => {
  try {

    const startOfWeek = moment().startOf('isoWeek').toDate();
    const endOfWeek = moment().endOf('isoWeek').toDate();
    const startOfMonth = moment().startOf('month').toDate();
    const endOfMonth = moment().endOf('month').toDate();

    const results = await User.aggregate([
      {
        $facet: {
          userCount: [
            { $match: { accountType: 'User' } },
            { $count: 'count' }
          ],
          hospitalCount: [
            { $match: { accountType: 'Hospital' } },
            { $count: 'count' }
          ],
          usersLastWeek: [
            {
              $match: {
                accountType: 'User',
                createdAt: { $gte: startOfWeek, $lt: endOfWeek }
              }
            },
            { $count: 'count' }
          ],
          hospitalsLastWeek: [
            {
              $match: {
                accountType: 'Hospital',
                createdAt: { $gte: startOfWeek, $lt: endOfWeek }
              }
            },
            { $count: 'count' }
          ],
          usersLastMonth: [
            {
              $match: {
                accountType: 'User',
                createdAt: { $gte: startOfMonth, $lt: endOfMonth }
              }
            },
            { $count: 'count' }
          ],
          hospitalsLastMonth: [
            {
              $match: {
                accountType: 'Hospital',
                createdAt: { $gte: startOfMonth, $lt: endOfMonth }
              }
            },
            { $count: 'count' }
          ]
        }
      }
    ]);

    const userCount = results[0].userCount[0] ? results[0].userCount[0].count : 0;
    const hospitalCount = results[0].hospitalCount[0] ? results[0].hospitalCount[0].count : 0;
    const usersLastWeek = results[0].usersLastWeek[0] ? results[0].usersLastWeek[0].count : 0;
    const hospitalsLastWeek = results[0].hospitalsLastWeek[0] ? results[0].hospitalsLastWeek[0].count : 0;
    const usersLastMonth = results[0].usersLastMonth[0] ? results[0].usersLastMonth[0].count : 0;
    const hospitalsLastMonth = results[0].hospitalsLastMonth[0] ? results[0].hospitalsLastMonth[0].count : 0;

    const result = {
      userCount,
      hospitalCount,
      usersLastWeek,
      hospitalsLastWeek,
      usersLastMonth,
      hospitalsLastMonth,
    }

    res.json({
      success: true,
      data: result
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: error.message });
  }
}