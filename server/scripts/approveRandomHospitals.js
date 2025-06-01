import mongoose from 'mongoose';
import User from '../model/User.js';
const MONGO_URI = ''

async function approveRandomHospitals() {
  try {
    const mongoDBURI = MONGO_URI;
    await mongoose.connect(mongoDBURI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    const hospitals = await User.find({
        accountType: 'Hospital',
        approvalStatus: 'Pending'
    });

    const count = hospitals.length;

    // Array of length 50 with random unique indexes between 0 and count
    const randomIndexes = [];
    while (randomIndexes.length < 50) {
        const randomIndex = Math.floor(Math.random() * count);
        if (!randomIndexes.includes(randomIndex)) {
            randomIndexes.push(randomIndex);
        }
    }

    for (const index of randomIndexes) {
        const hospital = hospitals[index];
        await User.findByIdAndUpdate(hospital._id, { approvalStatus: 'Approved' });
        console.log(`Hospital ${hospital._id} Approved`);
    }

  } catch (error) {
    console.error('Error Approving Hospitals', error);
  } finally {
    mongoose.disconnect();
  }
}

approveRandomHospitals()