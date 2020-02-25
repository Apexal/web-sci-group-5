require('dotenv').config();
const express = require('express');
const helmet = require('helmet');
const connectToMongoDB = require('./config/mongo');
const debug = require('debug')('app')

const app = express();
const port = process.env.PORT || 5000;

app.use(helmet()); // Setting HTTP headers for security
app.use(express.json()); // Let Express parse JSON request bodies

app.listen(port, () => debug(`Server running on port ${port}: http://localhost:${port}`));
connectToMongoDB();
