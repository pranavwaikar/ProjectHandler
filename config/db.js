const mongoose = require('mongoose');
const config = require('config');
const db = config.get('mongoURI');
const logger = require('./logger');

const connectDB = async () => {
  try {
    await mongoose.connect(db, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true,
      useFindAndModify: false,
    });
    logger.info('Connected to mongodb atlas..');
  } catch (err) {
    logger.error(`Not able to connect to mongodb atlas - ${err}`);
    // Exit app if failed to connect
    process.exit(1);
  }
};

module.exports = connectDB;
