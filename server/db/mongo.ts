import mongoose from "mongoose";

export const connectDB = async (mongoURI: string) => {
  try {
    await mongoose.connect(mongoURI!);
    console.log("MongoDB connected!");
  } catch (error) {
    console.error("MongoDB connection error:", error);
    process.exit(1);
  }
};
