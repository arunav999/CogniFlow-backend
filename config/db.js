import mongoose from "mongoose";

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI, {});
    console.log("Cogniflow DB connected");
  } catch (error) {
    console.error("Error connecting to CogniflowDB", error);
    process.exit(1);
  }
};

export default connectDB
