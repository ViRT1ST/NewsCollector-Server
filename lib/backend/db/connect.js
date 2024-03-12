import mongoose from 'mongoose';

let isConnected = false;

const connectDB = async () => {
  mongoose.set('strictQuery', true);

  // If already connected, don't connect again
  if (isConnected) {
    return;
  }

  try {
    await mongoose.connect(process.env.MONGODB_URI);
    isConnected = true;
    console.log('MongoDB connected.');
    
  } catch (error) {
    console.log(error);
    process.exit(1);
  }
};

export default connectDB;