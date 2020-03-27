const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// https://github.com/Apexal/web-sci-group-5/wiki/Textbooks
const schema = new Schema(
    {
        _textbook: { type: Schema.Types.ObjectId, ref: 'Textbook', required: true },
        _user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
        condition: { type: String, enum: ['new', 'very good', 'good', 'fair', 'poor'], required: true },
        proposedPrice: { type: Number, min: 0, max: 1000, required: true },
        sold: { type: Boolean, required: true }
    },
    {
        timestamps: true
    }
);

module.exports = mongoose.model('TextbookListing', schema);