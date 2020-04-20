const express = require('express');
const router = express.Router();
const debug = require('debug')('api');
const {JSDOM} = require('jsdom');

const { requireAuth, requireAdmin } = require('../utils');
const { getPeriods, getCourseFromPeriods } = require('../../../utils/courseScraping');

const Course = require('./courses.model');

router.get('/', async function(req, res) {
    try {
        const courses = await Course.find({});
        res.json(courses);
    } catch (e) {
        debug(e);
        return res.status(500).json({ error: 'There was an error getting all courses.' });
    }
});

router.post('/import', requireAdmin, async function (req, res, next) {
    const termCode = req.body.termCode;

    if (!termCode) {
        return res.status(400).json({ error: 'Missing termCode in request body.' });
    }
    try {
        const dom = await JSDOM.fromURL(`https://sis.rpi.edu/reg/zs${termCode}.htm`)
        const periods = getPeriods(dom.window.document, termCode);
        const courses = getCourseFromPeriods(periods, termCode);
    
        return res.json(courses);
    } catch (e) {
        debug(e);
        res.status(500).json({ error: 'There was an error importing the courses from the Registrar.' });
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