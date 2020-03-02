const express = require('express');
const router = express.Router();
const got = require('got');
const debug = require('debug')('api');

const Textbook = require('./textbooks.model');

/**
 * Gets a textbook with ID `textbookID`.
 * 
 * **Request Parameters**
 * - `textbookID` ObjectID string
 * 
 * **Response JSON**
 * - the found textbook object or error
 */
router.get('/:textbookID', async function getTextbook(req, res) {
    const textbookID = req.params.textbookID;

    let textbook;
    try {
        // Try to find textbook by ID, this fails if textbookID is not a valid ObjectID
        textbook = await Textbook.findById(textbookID);
    } catch (e) {
        debug(e);
        return res.status(500).json({ error: 'Could not get textbook.' });
    }

    // Does textbook exist?
    if (!textbook) {
        debug(`Could not find textbook with ID ${textbookID}`);
        return res.status(404).json({ error: 'Could not find textbook.' });
    }

    res.json(textbook);
});

/**
 * Posts textbook information to database if not found
 * 
 * **Request body**
 * - `crns` String[]
 * 
 * **Response JSON**
 * - The names of courses along with their instructors and textbooks
 * 
 * **Side effects**
 * - Saves each textbook's information to the database if not already stored
 */
router.post('/', async (req, res) => {
    try {
        // Check if CRNs were included in the request
        const { crns } = req.body;
        if (!crns) {
            return res.status(400).json({ error: 'Please include CRNs' });
        }

        // Modify all of the incoming CRNs to match the bookstore's format
        const courses = crns.map(crn => ({
            courseRefId: crn
        }));

        // Setup the bookstore's request's payload
        const json = {
            storeId: "373405",
            termId: "100061977",
            programId: "3764",
            courses
        };

        // Make request to get required textbooks based on CRNs
        const booksURL = 'https://svc.bkstr.com/courseMaterial/results?storeId=373405&langId=-1&catalogId=11077&requestType=DDCSBrowse';
        const { body } = await got.post(booksURL, {
            json,
            responseType: 'json'
        });

        // Parse out the data received from the bookstore's API to match our use case
        const coursesInfo = body[0].courseSectionDTO.map(course => {
            if (course.courseSectionStatus.code !== '500') {
                return {
                    courseName: `${course.department}-${course.course}-${course.section}`,
                    instructor: course.instructor,
                    textbooks: course.courseMaterialResultsList && course.courseMaterialResultsList.map(book => ({
                        image: `http:${book.bookImage}`,
                        title: book.title,
                        edition: book.edition,
                        authors: book.author,
                        isbn: book.isbn,
                        publisher: book.publisher
                    })) || []
                }
            }
        }).filter(course => course);

        // Add all textbooks to the database if they aren't stored yet
        const textbooks = [];
        coursesInfo.forEach(course => (
            course.textbooks && course.textbooks.forEach(async (textbook) => {
                try {
                    const found = await Textbook.findOne({ isbn: textbook.isbn });
                    if (!found) {
                        const book = new Textbook(textbook);
                        textbooks.push(book.save());
                    }
                } catch (e) {
                    debug(e);
                }
            })
        ));

        // Ensure all requests to save textbooks to the database are resolved
        await Promise.all(textbooks);

        return res.json(coursesInfo);
    } catch (e) {
        debug(e);
        return res.status(500).json({ error: 'Server error' });
    }
});

module.exports = router;