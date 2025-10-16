const mongoose = require('mongoose');
const logger = require('../utils/logger');

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });

    logger.info(`MongoDB Connected: ${conn.connection.host}`);
    return conn;
  } catch (error) {
    logger.error(`Database Connection Error: ${error.message}`);
    process.exit(1);
  }
};

// Handle connection events
mongoose.connection.on('disconnected', () => {
  logger.warn('MongoDB Connection Lost');
});

mongoose.connection.on('reconnected', () => {
  logger.info('MongoDB Reconnected');
});

process.on('SIGINT', async () => {
  await mongoose.connection.close();
  logger.info('MongoDB Connection Closed');
  process.exit(0);
});

module.exports = connectDB;