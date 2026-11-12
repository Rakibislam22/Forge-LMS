import mongoose from "mongoose";
import { env } from "./env.js";

let isConnecting = false;

export async function connectDB(): Promise<void> {
  // 1 = connected
  if (mongoose.connection.readyState === 1) {
    return;
  }

  // 2 = connecting, wait for completion
  if (mongoose.connection.readyState === 2 || isConnecting) {
    return new Promise((resolve) => {
      mongoose.connection.once("connected", () => resolve());
    });
  }

  try {
    isConnecting = true;
    await mongoose.connect(env.MONGODB_URI, {
      bufferCommands: false,
    });
    console.log(`✅ Connected to MongoDB at: ${env.MONGODB_URI.split("@").pop()}`);
  } catch (error) {
    console.error("❌ MongoDB connection error:", error);
    if (process.env.VERCEL) {
      throw error;
    } else {
      process.exit(1);
    }
  } finally {
    isConnecting = false;
  }
}
