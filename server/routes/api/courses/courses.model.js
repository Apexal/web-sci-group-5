const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// https://github.com/Apexal/web-sci-group-5/wiki/Courses
const schema = new Schema(
    {
        // crn: {
        //     type: String, minlength: 6, maxlength: 6, required: true,
        //     validate: val => !isNaN(parseFloat(val)) && isFinite(val) // Ensure its numeric
        // },
        subjectCode: { type: String, minlength: 1, maxlength: 5, required: true },
        code: { type: String, minlength: 4, maxlength: 4, required: true },
        title: { type: String, minlength: 1, maxlength: 200, required: true },
        sections: [{ 
            crn: { type: String },
            sectionId: { type: String },
            periods: [{ type: Object }]
         }]
        /**
         * sections: [
         *   crn: 'xxxx',
         *   sectionId: '01',
         *   periods: []
         * ]
         */
    },
    {
        timestamps: true
    }
);

module.exports = mongoose.model('Course', schema);