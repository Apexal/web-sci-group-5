const {JSDOM} = require('jsdom');

/**
 * Given two inconsistent time strings, convert them to 24-hour time in format `HH:mm`
 * 
 * @param {String} startTime String like '10:00' or '3:50PM' 
 * @param {String} endTime String like '10:00' or '3:50PM'
 * @returns {Object} Object with `startTime` and `endTime` in `HH:mm` format
 */
function determineTimes(startTime, endTime) {
    let [startHours, startMinutes] = startTime.split(':').map(piece => parseInt(piece))
    let [endHours, endMinutes] = endTime.replace('AM', '').replace('PM', '').split(':').map(piece => parseInt(piece))

    if (endTime.includes('PM')) {
        if (endHours < 12) {
            endHours += 12
        }
        if (startHours + 12 <= endHours) {
            startHours += 12
        }
    }

    return {
        startTime: `${String(startHours).padStart(2, '0')}:${String(startMinutes).padStart(2, '0')}`,
        endTime: `${String(endHours).padStart(2, '0')}:${String(endMinutes).padStart(2, '0')}`,
    }
}

/**
 * Given a term code and JSDOM document, parses the period rows to get every course period.
 * 
 * @param {JSDOM document} document JSDOM document of Registrar page
 * @param {String} termCode Registrar term code
 * @returns {Object[]} All period objects
 */
function getPeriods(document, termCode) {
    const rows = document.querySelectorAll('div > div > center table > tbody > tr')

    const periods = []
    let lastCRN
    let lastCourseSubjectCode
    let lastCourseNumber
    let lastCourseTitle
    rows.forEach(row => {
        const pieces = []
        const tds = row.querySelectorAll('td')
        tds.forEach(td => pieces.push(td.textContent.trim()))

        if (pieces.length === 0 || !pieces[5]) return

        let [crn, summary] = pieces[0].split(' ')
        let courseSubjectCode, courseNumber, sectionId
        if (!crn || !summary) {
            // Change of section
            crn = lastCRN
            courseSubjectCode = lastCourseSubjectCode
            courseNumber = lastCourseNumber
            courseTitle = lastCourseTitle
        } else {
            [courseSubjectCode, courseNumber, sectionId] = summary.split('-')
            courseTitle = pieces[1]
        }

        periods.push({
            termCode,
            crn,
            courseTitle,
            courseSubjectCode,
            courseNumber,
            sectionId,
            periodType: pieces[2],
            credits: pieces[3],
            days: pieces[5].replace(/ /g, '').split('').map(letter => ({ M: 1, T: 2, W: 3, R: 4, F: 5 }[letter])),
            instructors: pieces[8].split('/'),
            location: pieces[9],
            ...determineTimes(pieces[6], pieces[7]),
        })

        lastCRN = crn
        lastCourseSubjectCode = courseSubjectCode
        lastCourseNumber = courseNumber
        lastCourseTitle = courseTitle
    })

    return periods
}

/**
 * From a list of periods, find the unique courses and sections.
 * 
 * @param {Object[]} periods Array of period objects
 * @param {String} termCode Term code from SIS
 * @returns {Object[]} Array of courses with sections and periods
 */
function getCoursesFromPeriods(periods, termCode) {
    const courses = []

    for (const period of periods) {
        const { courseSubjectCode, courseNumber, crn, sectionId } = period

        let course = courses.find(c => c.subjectCode === courseSubjectCode && c.number === courseNumber);
        if (!course) {
            course = {
                termCode,
                subjectCode: courseSubjectCode,
                number: courseNumber,
                title: period.courseTitle,
                sections: []
            }
            courses.push(course)
        }

        let section = course.sections.find(section => section.crn === crn)
        if (!section) {
            section = {
                crn: crn,
                sectionId: sectionId,
                courseTitle: period.courseTitle,
                courseSubjectCode: period.courseSubjectCode,
                courseNumber: period.courseNumber,
                credits: period.credits,
                instructors: period.instructors,
                periods: []
            }
            course.sections.push(section)
        }

        section.periods.push(period)
    }

    return courses
}

module.exports = { getPeriods, getCoursesFromPeriods }