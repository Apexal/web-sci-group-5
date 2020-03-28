const express = require('express');
const router = express.Router();
const got = require('got');
const debug = require('debug')('api');

const Textbook = require('./textbooks.model');

/**
 * Get all textbooks.
 * 
 * **Response JSON**
 * - array of Textbook documents
 */
router.get('/', async function (req, res) {
    try {
        const textbooks = await Textbook.find({});
        res.json(textbooks);
    } catch (e) {
        debug(e);
        res.status(500).json({ error: 'There was an error getting all textbooks.' });
    }
});

/**
 * Middleware to find a Textbook from the request parameter 'textbookID'.
 * If not found it throws an error and does not continue to the actual controller. 
 */
async function getTextbookMiddleware(req, res, next) {
    const textbookID = req.params.textbookID;

    try {
        res.locals.textbook = await Textbook.findById(textbookID);
    } catch (e) {
        debug(e);
        return res.status(500).json({ error: 'Could not get textbook.' });
    }

    if (!res.locals.textbook) {
        debug(`Could not find textbook with ID ${textbookID}`);
        return res.status(404).json({ error: `Could not find textbook with id ${textbookID}.` });
    }

    next();
}

/**
 * Gets a textbook with ID `textbookID`.
 * 
 * **Request Parameters**
 * - `textbookID` ObjectID string
 * 
 * **Response JSON**
 * - the found Textbook document or error
 */
router.get('/:textbookID', getTextbookMiddleware, async function (req, res) {
    res.json(res.locals.textbook);
});

/**
 * Updates a textbook with ID `textbookID`.
 * 
 * **Request Parameters**
 * - `textbookID` ObjectID string
 * 
 * **Request Body**
 * - any textbook properties to update (excluding `_id`)
 * 
 * **Response JSON**
 * - the found and updated Textbook document or error
 */
router.patch('/:textbookID', getTextbookMiddleware, async function (req, res) {
    delete req.body._id;

    res.locals.textbook.set(req.body);
    try {
        await res.locals.textbook.save();
    } catch (e) {
        debug(e);
        return res.status(500).json({ error: 'Failed to update the textbook.' });
    }

    res.json(res.locals.textbook);
});

/**
 * Delete a textbook with ID `textbookID`.
 * 
 * **Request Parameters**
 * - `textbookID` ObjectID string
 * 
 * **Response JSON**
 * - the found and deleted Textbook document or error
 */
router.delete('/:textbookID', getTextbookMiddleware, async function (req, res) {
    try {
        await res.locals.textbook.remove();
    } catch (e) {
        debug(e);
        return res.status(500).json({ error: 'Failed to remove the textbook.' });
    }

    res.json(res.locals.textbook);
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
router.post('/import', async (req, res) => {
    try {
        // Check if CRNs were included in the request
        const { crns } = req.body;
        if (!crns || crns.length === 0) {
            return res.status(400).json({ error: 'Please include non-empty `crns` array in request body.' });
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
        const coursesInfo = body[0].courseSectionDTO
            .filter(course => course.courseSectionStatus.code !== '500')
            .map(course => ({
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
            }));

        // Add all textbooks to the database if they aren't stored yet
        const textbooks = [];
        coursesInfo.forEach(course => (
            course.textbooks && course.textbooks.forEach(async (textbook) => {
                try {
                    const found = await Textbook.findOne({ isbn: textbook.isbn });
                    if (!found) {
                        console.log(textbook);
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
