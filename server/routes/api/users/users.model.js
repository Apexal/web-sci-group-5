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

schema.set('toObject', { getters: true, virtuals: true });
schema.set('toJSON', { getters: true, virtuals: true });

schema.virtual('displayName').get(function () {
    let message = '';

    if (this.admin) message += 'Admin ';

    if (this.name.first || this.name.last) {
        message += this.name.first + ' ' + this.name.last;
    } else {
        message += this.username;
    }

    return message;
});

module.exports = mongoose.model('User', schema);