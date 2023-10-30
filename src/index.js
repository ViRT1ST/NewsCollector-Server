require('dotenv').config();

const express = require('express');
const cors = require('cors');

const articleRouter = require('./routers/article');
const sourceRouter = require('./routers/source');
const userRouter = require('./routers/user');

const errorHandler = require('./middleware/catch');
const connectToDB = require('./db/mongoose');

const app = express();
app.use(cors());
app.use(express.json());
app.use('/api', articleRouter);
app.use('/api', sourceRouter);
app.use('/api', userRouter);
app.use(errorHandler);

const port = process.env.EXPRESS_PORT;

app.listen(port, () => {
  console.log(`Server listening on ${port}`);
});

connectToDB();
