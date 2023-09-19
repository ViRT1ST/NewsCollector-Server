require('dotenv').config();

const mongoose = require('mongoose');
const express = require('express');
const cors = require('cors');

const articles = require('./api/articles');
const spider = require('./api/spider');
const users = require('./api/users');

const app = express();

/* ==================================== */
/*   Check connection to DB             */
/* ==================================== */

mongoose.set('strictQuery', true);

try {
  mongoose.connect(process.env.MONGO_URI);
  console.log('MongoDB connection established.');
} catch (err) {
  console.error(err.message);
  console.log('MongoDB connection failed.');
  process.exit(1);
}

/* ==================================== */
/*   Init middleware                    */
/* ==================================== */

app.use(express.json({ extended: false }));
app.use(cors());

/* ==================================== */
/*   Define routes                      */
/* ==================================== */

app.use('/api/articles', articles);
app.use('/api/spider', spider);
app.use('/api/users', users);

/* ==================================== */
/*   Run server                        */
/* ==================================== */

const PORT = process.env.SERVER_PORT;

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}.`);
});

app.get('/', (req, res) => {
  res.send('API is running.');
});
