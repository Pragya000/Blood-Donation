/* eslint-disable no-undef */
import User from "../model/User.js";
import Post from "../model/Post.js";
import Request from "../model/Request.js";
import mongoose from "mongoose";
import { isCompatible } from "../../src/data/compatibility.js";
import { decryptData } from "../utils/decodeEncode.js";
import { calculateAge } from "../utils/calculateAge.js";
import Certificate from "../model/Certificate.js";
import Review from "../model/Review.js";
const MONGO_FIELD_KEY = process.env.MONGO_FIELD_ENCRYPTION_SECRET;

// @desc    Create a Request
// @route   POST /api/request/create
// @access  Private
export const createRequest = async (req, res) => {
    try {
        const user = req.user;

        if (user?.approvalStatus !== 'Approved') {
            return res.status(400).json({ message: "You are not approved" });
        }

        if (user?.accountType !== 'User') {
            return res.status(400).json({ message: "Only User can create request" });
        }

        const { post, requestee, additionalInfo } = req.body;

        if (post && mongoose.Types.ObjectId.isValid(post)) {

            if (user?.accountType !== 'User') {
                return res.status(400).json({ message: "Only User can create request" });
            }

            const postObj = await Post.findById(post).populate('user');

            if (!postObj) {
                return res.status(400).json({ message: "Post not found" });
            }

            if (postObj.requestStatus !== 'Pending' && postObj.user?.accountType !== 'Hospital') {
                return res.status(400).json({ message: "Post is not valid" });
            }

            if (postObj.user._id.toString() === user._id.toString()) {
                return res.status(400).json({ message: "You can't request yourself" });
            }

            if (postObj.users.includes(user._id)) {
                return res.status(400).json({ message: "You have already requested" });
            }

            const donorBloodGroup = `${decryptData(user?.additionalFields?.bloodType, MONGO_FIELD_KEY)}${decryptData(user?.additionalFields?.rhFactor, MONGO_FIELD_KEY) === 'Positive' ? '+' : '-'}`
            const recipientBloodGroup = `${decryptData(postObj?.user?.additionalFields?.bloodType, MONGO_FIELD_KEY)}${decryptData(postObj?.user?.additionalFields?.rhFactor, MONGO_FIELD_KEY) === 'Positive' ? '+' : '-'}`
            const compatible = isCompatible(donorBloodGroup, recipientBloodGroup);

            if (!compatible) {
                return res.status(400).json({ message: "Blood group is not compatible" });
            }

            // requestee is recipient
            // requester is donor
            const payload = {
                requestee: postObj?.user?._id,
                requester: user?._id,
                post: postObj._id,
                requestType: 'Post'
            }

            await Request.create(payload);
            postObj.users.push(user?._id);
            await postObj.save();

            return res.status(201).json({ success: true, message: "Request created successfully" });
        }

        if (!requestee && !mongoose.Types.ObjectId.isValid(requestee)) {
            return res.status(400).json({ message: "Invalid requestee" });
        }

        const requesteeUser = await User.findById(requestee);

        if (!requesteeUser) {
            return res.status(400).json({ message: "Requestee not found" });
        }

        // requestee is donor
        // requester is recipient
        let payload = {
            requestee,
            requester: user._id,
        }

        if (requesteeUser.accountType === 'User') {

            const donorBloodGroup = `${decryptData(requesteeUser?.additionalFields?.bloodType, MONGO_FIELD_KEY)}${decryptData(requesteeUser?.additionalFields?.rhFactor, MONGO_FIELD_KEY) === 'Positive' ? '+' : '-'}`
            const recipientBloodGroup = `${decryptData(user?.additionalFields?.bloodType, MONGO_FIELD_KEY)}${decryptData(user?.additionalFields?.rhFactor, MONGO_FIELD_KEY) === 'Positive' ? '+' : '-'}`
            const compatible = isCompatible(donorBloodGroup, recipientBloodGroup);

            if (!compatible) {
                return res.status(400).json({ message: "Blood group is not compatible" });
            }

            payload['requestType'] = 'User';
        }

        if (requesteeUser.accountType === 'Hospital') {
            payload['requestType'] = 'Hospital';
        }

        if (additionalInfo) {
            payload['additionalInfo'] = additionalInfo;
        }

        await Request.create(payload);
        await User.findByIdAndUpdate(user._id, {
            $push: {
                requestedByMe:
                    new mongoose.Types.ObjectId(requestee)
            }
        });

        return res.status(201).json({ success: true, message: "Request created successfully" });

    } catch (error) {
        console.log(error)
        res.status(500).json({ success: false, message: "Internal server error" });
    }
}

// @desc    Get all Requests
// @route   GET /api/request/list
// @access  Private
export const listRequests = async (req, res) => {
    try {
        const user = req.user;

        if (user?.approvalStatus !== "Approved") {
            return res.status(400).json({ message: "You are not approved" });
        }

        const requests = await Request.find({
            $or: [{ requester: user._id }, { requestee: user._id }],
        })
            .populate("requester", "_id name profilePic email additionalFields accountType")
            .populate("requestee", "_id name profilePic email additionalFields accountType")
            .sort({ createdAt: -1 });

        const modifiedRequests = requests.map((request) => {
            let modifiedRequest = request.toObject();

            const requester = modifiedRequest.requester;
            const requestee = modifiedRequest.requestee;

            if(request?.status === 'Requested' && request?.status === 'Rejected') {
                requester.email = undefined;
                requestee.email = undefined;
            }

            if (requester.accountType === "User") {
                requester.additionalFields = {
                    bloodType: decryptData(
                        requester.additionalFields.bloodType,
                        MONGO_FIELD_KEY
                    ),
                    rhFactor: decryptData(
                        requester.additionalFields.rhFactor,
                        MONGO_FIELD_KEY
                    ),
                    age: calculateAge(
                        decryptData(requester.additionalFields.dateOfBirth, MONGO_FIELD_KEY)
                    ),
                    gender: requester.additionalFields.gender,
                    city: requester.additionalFields.city,
                };
            } else {
                requester.additionalFields = {
                    hospitalName: requester.additionalFields.hospitalName,
                    hospitalAddress: requester.additionalFields.hospitalAddress,
                    registrationNumber: requester.additionalFields.registrationNumber,
                    city: requester.additionalFields.city,
                };
            }

            if (requestee.accountType === "User") {
                requestee.additionalFields = {
                    bloodType: decryptData(
                        requestee.additionalFields.bloodType,
                        MONGO_FIELD_KEY
                    ),
                    rhFactor: decryptData(
                        requestee.additionalFields.rhFactor,
                        MONGO_FIELD_KEY
                    ),
                    age: calculateAge(
                        decryptData(requestee.additionalFields.dateOfBirth, MONGO_FIELD_KEY)
                    ),
                    gender: requestee.additionalFields.gender,
                    city: requestee.additionalFields.city,
                };
            } else {
                requestee.additionalFields = {
                    hospitalName: requestee.additionalFields.hospitalName,
                    hospitalAddress: requestee.additionalFields.hospitalAddress,
                    registrationNumber: requestee.additionalFields.registrationNumber,
                    city: requestee.additionalFields.city,
                };
            }

            return modifiedRequest;
        });

        return res.status(200).json({ success: true, requests: modifiedRequests });
    } catch (error) {
        console.log(error);
        res.status(500).json({ success: false, message: "Internal server error" });
    }
};


// @desc    Update Request Status
// @route   PUT /api/request/update/:id
// @access  Private
export const updateRequestStatus = async (req, res) => {
    try {
        const user = req.user;
        const { id } = req.params;
        const { status } = req.body;

        if (user?.approvalStatus !== "Approved") {
            return res.status(400).json({ message: "You are not approved" });
        }

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ message: "Invalid Request" });
        }

        const request = await Request.findById(id);

        if (!request) {
            return res.status(400).json({ message: "Request not found" });
        }

        if (request.requestType === 'Post') {
            if (request.requestee.toString() !== user._id.toString()) {
                return res.status(400).json({ message: "You are not allowed to update this request" });
            }
        } else {
            if (request.status === 'Requested') {
                if (request.requestee.toString() !== user._id.toString()) {
                    return res.status(400).json({ message: "You are not allowed to update this request" });
                }
            } else if (request.status === 'Accepted') {
                if (request.requester.toString() !== user._id.toString()) {
                    return res.status(400).json({ message: "You are not allowed to update this request" });
                }
            }
        }

        if (request.status === 'Fullfilled') {
            return res.status(400).json({ message: "Request is already fullfilled" });
        }

        let post
        if (request.status === 'Accepted' && request.requestType === 'Post') {
            post = await Post.findById(request.post);
        }

        if (status === 'Accepted' || status === 'Rejected') {
            request.status = status;
        }
        else if (status === 'Fulfilled') {
            request.status = 'Fulfilled';
            if (request.requestType === 'Post') {
                // generate certificate for requester
                const certificate = await Certificate.create({
                    user: request.requester,
                    request: request._id,
                    reason: 'Donation'
                })
                await User.findByIdAndUpdate(request.requester, {
                    $push: {
                        certificates: certificate._id,
                        requestsFullfilled: request._id
                    }
                })
                post.requestStatus = 'Approved';
                await post.save();
            } else if (request.requestType === 'User') {
                // generate certificate for requestee
                const certificate = await Certificate.create({
                    user: request.requestee,
                    request: request._id,
                    reason: 'Donation'
                })
                await User.findByIdAndUpdate(request.requestee, {
                    $push: {
                        certificates: certificate._id,
                        requestsFullfilled: request._id
                    }
                })
            } else {
                // create a review for requestee (hospital)
                const { reviewText, ratingPoints } = req.body;
                let review
                if (reviewText && ratingPoints) {
                    review = await Review.create({
                        reviewee: request.requestee,
                        reviewer: request.requester,
                        reviewText,
                        ratingPoints: parseInt(ratingPoints)
                    })
                }

                let push = {
                    requestsFullfilled: request._id
                }

                if (review) {
                    push['reviews'] = review._id
                }

                await User.findByIdAndUpdate(request.requestee, {
                    $push: push
                })
            }
        }
        else {
            return res.status(400).json({ message: "Invalid status" });
        }

        await request.save();
        return res.status(200).json({ success: true, message: "Request status updated successfully" });

    } catch (error) {
        console.log(error);
        res.status(500).json({ success: false, message: "Internal server error" });
    }
}