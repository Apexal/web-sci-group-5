require('dotenv').config();
const path = require('path');
const express = require('express');
const session = require('express-session');
const helmet = require('helmet');
const connectToMongoDB = require('./config/mongo');
const debug = require('debug')('app')
const passport = require('passport');
const app = express();
const port = process.env.PORT || 5000;

const mongoose = require('mongoose');
connectToMongoDB();


const MongoStore = require('connect-mongo')(session);

/* Set up session storage */
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
    store: new MongoStore({ mongooseConnection: mongoose.connection }),
    cookie: {
        secure: app.get('env') === 'production'
    }
}));

app.use(passport.initialize());
app.use(passport.session());

app.use(helmet()); // Setting HTTP headers for security
app.use(express.json()); // Let Express parse JSON request bodies

/* Middlware that all requests pass through first */
app.use((req, res, next) => {
    next();
});

app.use(require('./routes'));

// Send all non-API routes to the HTML file
app.use(function (req, res) {
    res.sendFile(path.join(__dirname, 'index.html'));
});

app.listen(port, () => debug(`Server running on port ${port}: http://localhost:${port}`));
