import mongoose from "mongoose";

const connectDB = async () => {
  try {
    const connection = mongoose.connect(process.env.MONGO_URI);
    console.log("MongoDB is connected....");
  } catch (error) {
    console.log("MongoDB is not connected....");
    process.exit(1);
  }
};

export default connectDB;
