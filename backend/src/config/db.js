import mongoose from 'mongoose';

const getMongoUri = () => {
  if (process.env.MONGO_URI) {
    return process.env.MONGO_URI;
  }

  if (process.env.NODE_ENV !== 'production') {
    const fallbackUri = 'mongodb://127.0.0.1:27017/jobsnap';
    console.warn('[JobSnap] MONGO_URI not set. Falling back to local MongoDB:', fallbackUri);
    return fallbackUri;
  }

  throw new Error('MONGO_URI is not defined in environment variables.');
};

export const connectDB = async () => {
  const mongoUri = getMongoUri();
  await mongoose.connect(mongoUri);
  console.log('MongoDB connected successfully');
};
