import mongoose from "mongoose";
import User from "../model/User.js";
import Post from "../model/Post.js";
const MONGO_URI =
  "";

function getRandomFutureDateTime() {
  const now = new Date();

  // Generate a random number of days in the future (between 1 and 365 days)
  const futureDays = Math.floor(Math.random() * 365) + 1;
  const futureDate = new Date(now.getTime() + futureDays * 24 * 60 * 60 * 1000);

  // Generate a random time between 10 AM and 4 PM
  const randomHour = Math.floor(Math.random() * (16 - 10)) + 10; // 10 AM to 4 PM
  const randomMinute = Math.floor(Math.random() * 60);
  const randomSecond = Math.floor(Math.random() * 60);

  futureDate.setHours(randomHour, randomMinute, randomSecond, 0);

  // Format the date and time as a string
  const year = futureDate.getFullYear();
  const month = String(futureDate.getMonth() + 1).padStart(2, "0");
  const day = String(futureDate.getDate()).padStart(2, "0");
  const hour = String(futureDate.getHours()).padStart(2, "0");
  const minute = String(futureDate.getMinutes()).padStart(2, "0");
  const second = String(futureDate.getSeconds()).padStart(2, "0");

  return `${year}-${month}-${day} ${hour}:${minute}:${second}`;
}

async function populateUserPosts() {
  try {
    const mongoDBURI = MONGO_URI;
    await mongoose.connect(mongoDBURI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    const users = await User.find({
      accountType: "User",
      approvalStatus: "Approved",
    }).sort({ createdAt: -1 });

    for (const user of users) {
      const payload = {
        user: user._id,
        type: "Request",
        location: user.additionalFields.location,
        requestStatus: "Pending",
      };

      const post1 = await Post.create(payload);
      const post2 = await Post.create(payload);
      payload.additionalInfo = "Need blood urgently, Contact Immediately!";
      const post3 = await Post.create(payload);
      await User.findByIdAndUpdate(user._id, {
        $push: { posts: [post1._id, post2._id, post3._id] },
      });
    }
  } catch (error) {
    console.error("Error Populating posts", error);
  } finally {
    mongoose.disconnect();
  }
}

async function populateHospitalPosts() {
  try {
    const mongoDBURI = MONGO_URI;
    await mongoose.connect(mongoDBURI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    const hospitals = await User.find({
      accountType: "Hospital",
      approvalStatus: "Approved",
    }).sort({ createdAt: -1 });

    const count = await User.countDocuments({
      accountType: "Hospital",
      approvalStatus: "Approved",
    });

    console.log("Total Hospitals", count);

    for (const user of hospitals) {
      console.log(
        "Populating Posts for Hospital:",
        user?.additionalFields?.hospitalName
      );

      // Random Date time string
      const randomDate = new Date(getRandomFutureDateTime());
      // Random integer between 100 and 1000
      const totalSeats = Math.floor(Math.random() * (1000 - 100) + 100);

      const payload = {
        user: user._id,
        type: "Camp",
        location: user.additionalFields.location,
        requestStatus: "NA",
        timing: randomDate,
        totalSeats: totalSeats,
      };

      const post1 = await Post.create(payload);
      const post2 = await Post.create(payload);
      payload.additionalInfo =
        "Blood Donation Camp, Join us for a good cause, Register Today!";
      const post3 = await Post.create(payload);
      await User.findByIdAndUpdate(user._id, {
        $push: { posts: [post1._id, post2._id, post3._id] },
      });
    }

    console.log("Posts Populated Successfully for all Hospitals");
  } catch (error) {
    console.error("Error Populating posts", error);
  } finally {
    mongoose.disconnect();
  }
}

// populateUserPosts();
// populateHospitalPosts();
