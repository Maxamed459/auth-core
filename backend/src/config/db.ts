import mongoose from "mongoose";
import { MONGODB_URI } from "./dotenv.js";
import { logger } from "./logger.js";

export const connectDb = async (): Promise<void> => {
  try {
    if (!MONGODB_URI) {
      throw new Error("MONGODB_URI is not set in environment variables.");
    }
    await mongoose.connect(MONGODB_URI);
    logger.info("MongoDB connected successfully");
  } catch (error) {
    process.exit(1);
  }
};
