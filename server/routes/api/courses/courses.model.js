const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// https://github.com/Apexal/web-sci-group-5/wiki/Courses
const schema = new Schema(
    {
        termCode: { type: String, required: true },
        subjectCode: { type: String, minlength: 1, maxlength: 5, required: true },
        number: { type: String, minlength: 4, maxlength: 4, required: true },
        title: { type: String, minlength: 1, maxlength: 200, required: true },
        sections: [{ 
            crn: { type: String },
            sectionId: { type: String },
            periods: [{ type: Object }]
         }]
    },
    {
        timestamps: true
    }
);

module.exports = mongoose.model('Course', schema);