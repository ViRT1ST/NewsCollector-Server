require('dotenv').config();

const connectDB = require('../lib/backend/db/connect');

const Source = require('../lib/backend/db/models/source');
const User = require('../lib/backend/db/models/user');
const { sources, users } = require('./collections');

const populateSources = async (array) => {
  const result = await Source.create(array);
  console.log(`Sources: objects in array: ${array.length}`);
  console.log(`Sources: inserted objects: ${result.length}`);
};

const populateUsers = async (array) => {
  const result = await User.create(array);
  console.log(`Users: objects in array: ${array.length}`);
  console.log(`Users: inserted objects: ${result.length}`);
};

const populateAll = async () => {
  await connectDB();
  await populateSources(sources);
  // await populateUsers(users);
  process.exit(1);
};

populateAll();
