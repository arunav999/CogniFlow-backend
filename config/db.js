// ==================== Database Configuration ====================
// Handles MongoDB connection using Mongoose

import mongoose from "mongoose";

// Connect to MongoDB database
const connectDB = async () => {
  try {
    // Attempt to connect using environment variable
    await mongoose.connect(process.env.MONGO_URI, {});
    console.log("Cogniflow Mongo DB connected");
  } catch (error) {
    // Log error and exit process if connection fails
    console.error("Error connecting to CogniflowDB", error);
    process.exit(1);
  }
};

export default connectDB;
