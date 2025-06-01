import User from "../model/User.js";
import { createRequire } from 'node:module';
const require = createRequire(import.meta.url);
import { sendUserResponse } from "../utils/user.js";
import { uploadImageToCloudinary } from "../utils/cloudinary.js";
import { getRandomCoordinates } from "../utils/distance.js";
const cityData = require('../data/indian_cities.json');
import Review from "../model/Review.js";

// @desc   Create Hospital Details
// route   POST /api/profile/create-user-details
// access  Private
export const createHospitalDetails = async (req, res) => {
    try {

        const user = req.user;

        const { registrationNumber, hospitalName, hospitalAddress, cityId } = req.body;

        if (!registrationNumber || !hospitalName || !cityId || !hospitalAddress || !req.files || !req.files.registrationCertificate) {
            return res.status(400).json({ error: 'All required fields must be filled and files must be uploaded' });
        }

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

        const registrationCertificateFile = req.files.registrationCertificate;
        const registrationCertificateResult = await uploadImageToCloudinary(registrationCertificateFile, `hospital/${user._id}`)

        const hospitalImages = [];
        for (let i = 0; i < 3; i++) {
            if (req.files?.[`hospitalImages[${i}]`]) {
                const hospitalImageFile = req.files[`hospitalImages[${i}]`];
                const hospitalImageResult = await uploadImageToCloudinary(hospitalImageFile, `hospital/${user._id}`);
                hospitalImages.push(hospitalImageResult.secure_url);
            }
        }

        const updatedUser = await User.findOneAndUpdate({ _id: user._id }, {
            profilePic: `https://ui-avatars.com/api/?size=512&background=FF5757&color=fff&name=${hospitalName}`,
            additionalFields: {
                hospitalName,
                registrationNumber,
                hospitalAddress,
                registrationCertificate: registrationCertificateResult.secure_url,
                hospitalImages,
                city: city?.city_ascii,
                location: {
                    type: "Point",
                    coordinates: [randomCoordinates?.longitude, randomCoordinates?.latitude],
                },
            },
            approvalStatus: 'Pending'
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

    } catch (error) {
        console.log(error);
        return res.status(500).json({ success: false, error: "Something went wrong" });
    }
}

// @desc   Get Hospital Reviews
// route   POST /api/profile/get-hospital-reviews
// access  Private
export const getHospitalReviews = async (req, res) => {
    try {

        const user = req.user;

        let reviews = user.reviews;

        if (!reviews || reviews.length === 0) {
            return res.status(200).json({
                success: true,
                reviews: []
            });
        }

        reviews = await Review.find({ _id: { $in: reviews } }).populate('reviewer', 'name profilePic');

        return res.status(200).json({
            success: true,
            reviews
        });

    } catch (error) {
        console.log(error);
        return res.status(500).json({ success: false, error: "Something went wrong" });
    }
}