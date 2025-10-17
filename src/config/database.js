const mongoose = require('mongoose');
const logger = require('../utils/logger');

const connectDB = async () => {
  try {
    // Remove deprecated options
    const conn = await mongoose.connect(process.env.MONGODB_URI);

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

mongoose.connection.on('error', (err) => {
  logger.error(`MongoDB Error: ${err.message}`);
});

process.on('SIGINT', async () => {
  await mongoose.connection.close();
  logger.info('MongoDB Connection Closed');
  process.exit(0);
});

module.exports = connectDB;