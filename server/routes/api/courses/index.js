const express = require('express');
const router = express.Router();
const debug = require('debug')('api');

const Course = require('./courses.model');

const { JSDOM } = require('jsdom');

function getPeriods(document) {
    const rows = document.querySelectorAll('div > div > center table > tbody > tr');

    const periods = [];
    let lastCRN;
    let lastCourseSubjectCode;
    let lastCourseNumber;
    let lastCourseTitle;
    rows.forEach(row => {
        const pieces = [];
        const tds = row.querySelectorAll('td');
        tds.forEach(td => pieces.push(td.textContent.trim()));

        if (pieces.length === 0 || !pieces[5]) return;

        let [crn, summary] = pieces[0].split(' ');
        let courseSubjectCode, courseNumber, sectionId;
        if (!crn || !summary) {
            // Change of section
            crn = lastCRN
            courseSubjectCode = lastCourseSubjectCode;
            courseNumber = lastCourseNumber;
            courseTitle = lastCourseTitle;
        } else {
            [courseSubjectCode, courseNumber, sectionId] = summary.split('-');
            courseTitle = pieces[1];
        }

        periods.push({
            crn,
            courseTitle,
            courseSubjectCode,
            courseNumber,
            sectionId,
            periodType: pieces[2],
            credits: pieces[3],
            days: pieces[5].replace(/ /g, '').split('').map(letter => ({ M: 1, T: 2, W: 3, R: 4, F: 5 }[letter])),
            startTime: pieces[6],
            endTime: pieces[7],
            instructors: pieces[8].split('/'),
            location: pieces[9]
        });

        lastCRN = crn;
        lastCourseSubjectCode = courseSubjectCode;
        lastCourseNumber = courseNumber;
        lastCourseTitle = courseTitle;
    });

    return periods;
}

function getCourseFromPeriods (periods) {
    const courses = {};

    for (const period of periods) {
        const { courseSubjectCode, courseNumber, crn, sectionId } = period;
        const courseKey = courseSubjectCode + '-' + courseNumber
        if (!(courseKey in courses)) {
            courses[courseKey] = [];
        }

        let section = courses[courseKey].find(section => section.crn === crn);
        if (!section) {
            section = {
                crn: crn,
                sectionId: sectionId,
                periods: []
            };
            courses[courseKey].push(section);
        }

        section.periods.push({
            periodType: period.periodType,
            credits: period.credits,
            days: period.days,
            startTime: period.startTime,
            endTime: period.endTime,
            instructors: period.instructors,
            location: period.location
        });
    }

    return courses;
}

router.get('/', async function (req, res) {
    const dom = await JSDOM.fromURL(`https://sis.rpi.edu/reg/zs202001.htm`)
    const periods = getPeriods(dom.window.document);
    const courses = getCourseFromPeriods(periods);

    res.json(courses);
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