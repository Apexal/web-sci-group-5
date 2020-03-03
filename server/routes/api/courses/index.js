const express = require('express');
const router = express.Router();
const debug = require('debug')('api');
const {JSDOM} = require('jsdom');

const { getPeriods, getCourseFromPeriods } = require('../../../utils/courseScraping');

const Course = require('./courses.model');

router.get('/', async function (req, res, next) {
    try {
        const dom = await JSDOM.fromURL(`https://sis.rpi.edu/reg/zs202001.htm`)
        const periods = getPeriods(dom.window.document);
        const courses = getCourseFromPeriods(periods);
    
        return res.json(courses);
    } catch (e) {
        return next(e);
    }
});

/**
 * Gets a course with ID `courseID`.
 * 
 * **Request Parameters**
 * - `courseID` ObjectID string
 * 
 * **Response JSON**
 * - the found course object or error
 */
router.get('/:courseID', async function getCourse(req, res) {
    const courseID = req.params.courseID;

    let course;
    try {
        // Try to find course by ID, this fails if courseID is not a valid ObjectID
        course = await Course.findById(courseID);
    } catch (e) {
        debug(e);
        return res.status(500).json({ error: 'Could not get course.' });
    }

    // Does course exist?
    if (!course) {
        debug(`Could not find course with ID ${courseID}`);
        return res.status(404).json({ error: 'Could not find course.' });
    }

    res.json(course);
});

module.exports = router;