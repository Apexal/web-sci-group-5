require('dotenv').config();
const express = require('express');
const session = require('express-session');
const helmet = require('helmet');
const connectToMongoDB = require('./config/mongo');
const debug = require('debug')('app')
const passport = require('passport');
const app = express();
const port = process.env.PORT || 5000;

/* Set up session storage */
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
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

app.listen(port, () => debug(`Server running on port ${port}: http://localhost:${port}`));
connectToMongoDB();
