const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// https://github.com/Apexal/web-sci-group-5/wiki/Users
const schema = new Schema(
    {
        username: { type: String, required: true, minlength: 1, maxlength: 20 },
        name: {
            first: { type: String },
            preferred: { type: String },
            last: { type: String },
        },
    },
    {
        timestamps: true
    }
);

module.exports = mongoose.model('User', schema);