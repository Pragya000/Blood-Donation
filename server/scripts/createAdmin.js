import mongoose from 'mongoose';
import User from '../model/User.js';
import * as crypto from 'crypto';

async function createAdmin() {

  // KEYS
  const MONGO_URI = ''
  const SECRET = ''

  try {
    const mongoDBURI = MONGO_URI;
    await mongoose.connect(mongoDBURI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    
    const email = 'admin@bloodconnect.in'
    const password = 'Admin@123'
    const accountType = 'Admin'

    // hash the password
    const hashedPassword = crypto
      .createHmac("sha256", SECRET)
      .update(password)
      .digest("hex");

    // Create new user
    const newUser = new User({
      email,
      accountType,
      password: hashedPassword,
      approvalStatus: "Approved"
    });

    // Save user to the database
    await newUser.save();

    console.log('Admin Created Successfully');

  } catch (error) {
    console.error('Error Creating Admin:', error);
  } finally {
    mongoose.disconnect();
  }
}

createAdmin();