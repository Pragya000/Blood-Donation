/* eslint-disable no-undef */
import jwt from "jsonwebtoken";
import User from "../model/User.js";

const hospital_auth = async (req, res, next) => {
    try {
        const token = req.cookies.token;
        if (!token) {
            return res
                .status(401)
                .json({ success: false, error: "You must be logged in" });
        }
        const decoded = jwt.verify(token, process.env.SECRET);
        const user = await User.findById(decoded.id);
        if (!user) {
            return res
                .status(401)
                .json({ success: false, error: "You must be logged in" });
        }

        if (!(user.accountType === 'Hospital' || user.accountType === 'Admin')) {
            return res
                .status(401)
                .json({ success: false, error: "You must be logged in as a Hospital" });
        }

        req.user = user;

        next();
    } catch (error) {
        console.log(error);
        return res
            .status(500)
            .json({ success: false, error: "Something went wrong" });
    }
};

export default hospital_auth;
