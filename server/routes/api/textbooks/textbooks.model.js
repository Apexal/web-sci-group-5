const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// https://github.com/Apexal/web-sci-group-5/wiki/Textbooks
const schema = new Schema(
    {
        title: { type: String, required: true, minlength: 3, maxlength: 200 },
        isbn: { type: String, required: true, minlength: 7, maxlength: 10 },
        authors: { type: String, required: true, minlength: 1, maxlength: 100 },
        publisher: { type: String, required: true, minlength: 1, maxlength: 100 },
        edition: { type: Number, required: true, default: 1 },
        retailPrice: { type: Number }
    },
    {
        timestamps: true
    }
);

module.exports = mongoose.model('Textbook', schema);