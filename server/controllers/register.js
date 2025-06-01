/* eslint-disable no-undef */
import mongoose from "mongoose";
import Post from "../model/Post.js";
import Registration from "../model/Registration.js";
import User from "../model/User.js";
import Certificate from "../model/Certificate.js";
import { decryptData } from "../utils/decodeEncode.js";
import { calculateAge } from "../utils/calculateAge.js";
import _ from "lodash";
const MONGO_FIELD_KEY = process.env.MONGO_FIELD_ENCRYPTION_SECRET;

// @desc    Register a new user
// @route   POST /api/register/create
// @access  Public
export const create = async (req, res) => {
    try {
        const {postId} = req.params;
        const user = req.user;

        if (user?.accountType !== 'User' || user?.approvalStatus !== 'Approved') {
            return res.status(400).json({ success: false, error: 'You are not authorized to register' });
        }

        if(!mongoose.Types.ObjectId.isValid(postId)) {
            return res.status(400).json({ success: false, error: 'Invalid Post ID' });
        }

        const post = await Post.findById(postId);

        if(!post) {
            return res.status(404).json({ success: false, error: 'Post not found' });
        }

        if(post?.user === user?._id) {
            return res.status(400).json({ success: false, error: 'You cannot register for your own post' });
        }

        if(post?.users?.includes(user?._id)) {
            return res.status(400).json({ success: false, error: 'You have already registered for this Camp' });
        }

        if(post?.totalSeats === post?.users?.length) {
            return res.status(400).json({ success: false, error: 'Camp is full' });
        }

        if(post?.timing < new Date()) {
            return res.status(400).json({ success: false, error: 'Camp has already ended' });
        }

        post.users.push(user?._id);
        
        await Registration.create({
            user: user?._id,
            hospital: post?.user,
            status: 'Registered',
            post: post?._id
        })

        await post.save();

        return res.status(201).json({ success: true, data: 'Registered successfully' });

    } catch (error) {
        console.error(error);
        return res.status(500).json({ success: false, error: "Server Error" });
    }
}

// @desc   List Registrations for User
// @route  GET /api/register/list
// @access Private
export const listUserRegistrations = async (req, res) => {
    try {
        const user = req.user;

        if(user?.accountType !== 'User' || user?.approvalStatus !== 'Approved') {
            return res.status(400).json({ success: false, error: 'Invalid Account' });
        }

        const allRegistrations = await Registration.find({ user: user?._id })
        .populate({
            path: 'post',
            select: 'timing totalSeats additionalInfo',
        }).populate({
            path: 'hospital',
            select: 'profilePic additionalFields.hospitalName additionalFields.registrationNumber additionalFields.city',
        }).sort({ createdAt: -1 });

        return res.status(200).json({ success: true, data: allRegistrations });

    } catch (error) {
        console.error(error);
        return res.status(500).json({ success: false, error: "Server Error" });
    }
}

// @desc   List Registrations for Hospital
// @route  GET /api/register/list/hospital
// @access Private
export const listHospitalRegistrations = async (req, res) => {
    try {
        const user = req.user;

        if(user?.accountType !== 'Hospital' || user?.approvalStatus !== 'Approved') {
            return res.status(400).json({ success: false, error: 'Invalid Account' });
        }

        const allRegistrations = await Registration.find({ hospital: user?._id })
        .populate('post', 'type timing additionalInfo')
        .populate('user', 'profilePic name email additionalFields')
        .sort({ createdAt: -1 })
        .lean().exec();

        const modifiedAllRegistrations = allRegistrations.map(registration => {
            const copyRegistration = _.cloneDeep(registration);
            const copyUser = _.cloneDeep(registration.user);
            copyUser.additionalFields = {
                bloodType: decryptData(registration.user.additionalFields.bloodType, MONGO_FIELD_KEY),
                rhFactor: decryptData(registration.user.additionalFields.rhFactor, MONGO_FIELD_KEY),
                age: calculateAge(decryptData(registration.user.additionalFields.dateOfBirth, MONGO_FIELD_KEY)),
                gender: registration.user.additionalFields.gender,
                city: registration.user.additionalFields.city,
            }
            copyRegistration.user = copyUser;
            return copyRegistration;
        })

        return res.status(200).json({ success: true, data: modifiedAllRegistrations });

    } catch (error) {
        console.error(error);
        return res.status(500).json({ success: false, error: "Server Error" });
    }
}

// @desc   Update Registration Status
// @route  PUT /api/register/update/:registrationId
// @access Private
export const update = async (req, res) => {
    try {
        const {registrationId} = req.params;
        const user = req.user;

        if(user?.accountType !== 'Hospital' || user?.approvalStatus !== 'Approved') {
            return res.status(400).json({ success: false, error: 'Invalid Account' });
        }

        if(!mongoose.Types.ObjectId.isValid(registrationId)) {
            return res.status(400).json({ success: false, error: 'Invalid Registration ID' });
        }

        const registration = await Registration.findById(
            new mongoose.Types.ObjectId(registrationId)
        );

        if(!registration) {
            return res.status(404).json({ success: false, error: 'Registration not found' });
        }

        if(registration?.hospital.toString() !== user?._id?.toString()) {
            return res.status(400).json({ success: false, error: 'You are not authorized to update this registration' });
        }

        registration.status = 'Fulfilled';

        // generate certificate
        const certificate = await Certificate.create({
            user: registration.user,
            registration: registration._id,
            reason: 'Donation Camp'
        })

        await User.findByIdAndUpdate(user?._id, {
            $push: { 
                campsParticipatedIn: registration.post,
                certificates: certificate._id
            }
        });

        await registration.save();

        return res.status(200).json({ success: true, data: 'Registration updated successfully' });

    } catch (error) {
        console.error(error);
        return res.status(500).json({ success: false, error: "Server Error" });
    }
}