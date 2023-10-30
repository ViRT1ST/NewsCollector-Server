const mongoose = require('mongoose');

const connectToDB = async () => {
  const url = process.env.MONGODB_URL;

  const options = {
    useUnifiedTopology: true,
    useNewUrlParser: true,
  };

  try {
    await mongoose.connect(url, options);
    console.log('MongoDB connection established');
  } catch (error) {
    console.error(error.message);
    process.exit(1);
  }
};

module.exports = connectToDB;
