const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    await mongoose.connect(connectionString, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      connectTimeoutMS: 30000, // 30 seconds
      socketTimeoutMS: 45000,  // 45 seconds
    });
    console.log('MongoDB connected successfully');
  } catch (error) { 
    console.error('MongoDB connection error:', error);
    console.log('Error details:', {
      message: error.message,
      name: error.name,
      stack: error.stack,
      errno: error.errno,
      code: error.code,
      syscall: error.syscall,
    });
    process.exit(1); // Exit process with failure
  }
};

module.exports = connectDB;
