const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// https://github.com/Apexal/web-sci-group-5/wiki/Textbooks
const schema = new Schema(
    {
        image: { type: String },
        title: { type: String, required: true, minlength: 3, maxlength: 200 },
        subtitle: { type: String, maxlength: 500 },
        description: { type: String, maxlength: 2000 },
        categories: [{ type: String }],
        isbn: { type: String, required: true, minlength: 10, maxlength: 17 },
        authors: { type: String, required: true, minlength: 1, maxlength: 100 },
        pageCount: { type: Number, minlength: 1 },
        publisher: { type: String, required: true, minlength: 1, maxlength: 100 },
        edition: { type: String, required: true, default: "1st" },
        retailPrice: { type: Number }
    },
    {
        timestamps: true
    }
);

module.exports = mongoose.model('Textbook', schema);