const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// https://github.com/Apexal/web-sci-group-5/wiki/Users
const schema = new Schema(
    {
        _courses: [{ type: Schema.Types.ObjectId, ref: 'Course' }],
        stripeAccountID: { type: String, required: true },
        username: { type: String, required: true, minlength: 1, maxlength: 20 },
        name: {
            first: { type: String },
            preferred: { type: String },
            last: { type: String },
        },
        admin: { type: Boolean, default: false }
    },
    {
        timestamps: true
    }
);

module.exports = mongoose.model('User', schema);