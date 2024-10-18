import mongoose from 'mongoose';

const connectDB = async (DATABASE_URL) => {
  try {
    const DB_OPTIONS = {
      dbName: "demo", // Database name
    };

    await mongoose.connect(DATABASE_URL, DB_OPTIONS);
    console.log('Connected Successfully...');
  } catch (error) {
    console.log('Error connecting to the database:', error);
  }
};

export default connectDB;
