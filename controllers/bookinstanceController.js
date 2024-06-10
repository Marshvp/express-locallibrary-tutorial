const BookInstance = require('../models/bookinstance');
const asyncHandler = require('express-async-handler');
const Book = require('../models/book');
const { body, validationResult } = require('express-validator');

exports.bookinstance_list = asyncHandler(async (req, res, next) => {
    
    const bookinstances = await BookInstance.find().populate('book').exec();

    res.render('bookinstance_list', {
        title: 'Book Instance List',
        bookinstance_list: bookinstances
    })
})

exports.bookinstance_detail = asyncHandler(async (req, res, next) => {
    
    const bookinstance = await BookInstance.findById(req.params.id)
        .populate('book')
        .exec();

    if (bookinstance === null) {
        // No results.
        const err = new Error('Book copy not found');
        err.status = 404;
        return next(err);
    }

    res.render('bookinstance_detail', {
        title: 'Book Instance Detail',
        bookinstance: bookinstance
    })
})  

exports.bookinstance_create_get = asyncHandler(async (req, res, next) => {
    const allBooks = await Book.find({}).exec();

    res.render('bookinstance_form', {
        title: 'Create BookInstance',
        book_list: allBooks
    })
})

exports.bookinstance_create_post = [

    body('book', 'Book must be specified')
        .trim()
        .isLength({ min: 1 })
        .escape(),
    body('status').escape(),
    body('due_back', 'Invalid date')
        .optional({ values: 'falsy' })
        .isISO8601()
        .toDate(),

    asyncHandler(async (req, res, next) => {
        const errors = validationResult(req);

        const bookinstance = new BookInstance({
            book: req.body.book,
            imprint: req.body.imprint,
            status: req.body.status,
            due_back: req.body.due_back
        })

        if(!errors.isEmpty()) {
            const allBooks = await Book.find({}).exec();
            res.render('bookinstance_form', {
                title: 'Create BookInstance',
                book_list: allBooks,
                selected_book: bookinstance.book._id,
                errors: errors.array(),
                bookinstance: bookinstance
            })
            return; 
        } else {
            await bookinstance.save();
            res.redirect(bookinstance.url);
        }
    })
]


exports.bookinstance_delete_get = asyncHandler(async (req, res, next) => {
    const bookInstance = await BookInstance.findById(req.params.id).exec();

    if (bookInstance === null) {
        res.redirect('/catalog/bookinstances');
    }

    res.render('bookinstance_delete', {
        title: "Delete Book Instance",
        bookinstance: bookInstance
    })


})

exports.bookinstance_delete_post = asyncHandler(async (req, res, next) => {
    await BookInstance.findByIdAndDelete(req.params.id).exec();
    res.redirect('/catalog/bookinstances')
})

exports.bookinstance_update_get = asyncHandler(async (req, res, next) => {
    const bookInstance = await BookInstance.findById(req.params.id).populate('book').exec();
    const allBooks = await Book.find({}).exec();

    if (bookInstance === null) {
        res.redirect('/catalog/bookinstances');
    }

    res.render('bookinstance_update', {
        title: "Update Book Instance",
        bookinstance: bookInstance,
    })
})

exports.bookinstance_update_post = [

    
    body('imprint', 'Imprint must not be empty')
        .trim()
        .isLength({ min: 1 })
        .escape(),
    body('status').escape(),
    body('due_back', 'Invalid date')
        .optional({ values: 'falsy' })
        .isISO8601()
        .toDate(),
    
    asyncHandler(async (req, res, next) => {
        const errors = validationResult(req);

        const bookinstance = new BookInstance({
            book: req.body.book,
            imprint: req.body.imprint,
            status: req.body.status,
            due_back: req.body.due_back,
            _id: req.params.id
        })

        if(!errors.isEmpty()) {
            const originalBookInstance = await BookInstance.findById(req.params.id).populate('book').exec();
            res.render('bookinstance_update', {
                title: "Update Book Instance",
                bookinstance: originalBookInstance,
                errors: errors.array(),
            })
        } else {
            await BookInstance.findByIdAndUpdate(req.params.id, bookinstance).exec();
            res.redirect(bookinstance.url);
        }


    })
]