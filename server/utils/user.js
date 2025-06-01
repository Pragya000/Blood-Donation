/* eslint-disable no-undef */
import { decryptData } from "./decodeEncode.js";
const MONGO_FIELD_KEY = process.env.MONGO_FIELD_ENCRYPTION_SECRET;

export const sendUserResponse = (user) => {
    if (!user?.additionalFields) {
        user.additionalFields = undefined;
    } else {
        if (user.accountType === "User") {
            user.additionalFields = {
                dateOfBirth: decryptData(user?.additionalFields?.dateOfBirth, MONGO_FIELD_KEY),
                gender: user?.additionalFields?.gender,
                bloodType: decryptData(user?.additionalFields?.bloodType, MONGO_FIELD_KEY),
                rhFactor: decryptData(user?.additionalFields?.rhFactor, MONGO_FIELD_KEY),
                city: user?.additionalFields?.city,
            };
        } else if (user.accountType === "Hospital") {
            user.additionalFields = {
                registrationNumber: user?.additionalFields?.registrationNumber,
                hospitalName: user?.additionalFields?.hospitalName,
                hospitalAddress: user?.additionalFields?.hospitalAddress,
                city: user?.additionalFields?.city,
                hospitalImages: user?.additionalFields?.hospitalImages,
                registrationCertificate: user?.additionalFields?.registrationCertificate,
            };
        }
    }

    user.password = undefined;

    return user;
}