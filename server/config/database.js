/* eslint-disable no-undef */
import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

const { MONGODB_URI } = process.env;

console.log("Using MongoDB URI:", process.env.MONGODB_URI);


export default function connect() {
  mongoose
    .connect(MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    })
    .then(console.log(`DB Connection Success`))
    .catch((err) => {
      console.log(`DB Connection Failed`);
      console.log(err);
      process.exit(1);
    });
}
console.log("Connecting to MongoDB:", MONGODB_URI);  // add this line
