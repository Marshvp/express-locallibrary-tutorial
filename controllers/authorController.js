const Author = require("../models/author");
const Book = require("../models/book");
const asyncHandler = require("express-async-handler");
const { body, validationResult} = require("express-validator");

exports.author_list = asyncHandler(async (req, res, next) => {
    const allAuthors = await Author.find().sort({name: 1}).exec();
    res.render("author_list", { title: "Author List", author_list: allAuthors })
})

exports.author_detail = asyncHandler(async (req, res, next) => {
    const [author, allbooksfromauthor] = await Promise.all([
        Author.findById(req.params.id).exec(),
        Book.find({ author: req.params.id }).exec()
    ]);
    if (author === null) {
        // No results.
        const err = new Error("Author not found");
        err.status = 404;
        return next(err);
    }
    res.render("author_detail", {
        title: "Author Detail",
        author: author,
        author_books: allbooksfromauthor
    })
})

exports.author_create_get = asyncHandler(async (req, res, next) => {
    res.render("author_form", { title: "Create Author" })
})

exports.author_create_post = [

    body("first_name")
        .trim()
        .isLength({ min: 1 })
        .escape()
        .withMessage("Author name must be at least 1 characters long"),
    body("family_name")
        .trim()
        .isLength({ min: 1 })
        .escape()
        .withMessage("Author name must be at least 1 characters long"),
    body("Date of Birth", "Invalid date")
        .optional({ values: "falsy" })
        .isISO8601()
        .toDate(),
    body("Date of Death", "Invalid date")
        .optional({ values: "falsy" })
        .isISO8601()
        .toDate(),

    asyncHandler(async (req, res, next) => {

        const errors = validationResult(req);

        const author = new Author({
            first_name: req.body.first_name,
            family_name: req.body.family_name,
            date_of_birth: req.body.date_of_birth,
            date_of_death: req.body.date_of_death
        })

        if(!errors.isEmpty()) {

            res.render("author_form", {
                title: "Create Author",
                author: author,
                errors: errors.array()
            });
        return;
        } else {
            await author.save();
            res.redirect(author.url);
        }
    })
]


exports.author_delete_get = asyncHandler(async (req, res, next) => {
    const [ author, allAuthorBooks ] = await Promise.all([
        Author.findById({ _id: req.params.id }).exec(),
        Book.find({ author: req.params.id }, "title summary").exec(
        )
    ])

    if (author === null) {
        res.redirect("/catalog/author")
    }

    res.render("author_delete", {
        title: "Delete Author",
        author: author,
        author_books: allAuthorBooks
    })
})

exports.author_delete_post = asyncHandler(async (req, res, next) => {
    const [ author, allAuthorBooks ] = await Promise.all([
        Author.findById({ _id: req.params.id }).exec(),
        Book.find({ author: req.params.id }, "title summary").exec(
        )
    ])

    if (allAuthorBooks.length > 0) {
        res.render('author_delete', {
            title: 'Delete Author',
            author: author,
            author_books: allAuthorBooks
        })
        return
    } else {
        await Author.findByIdAndDelete(req.body.authorid);
        res.redirect("/catalog/author")
    }
});

exports.author_update_get = asyncHandler(async (req, res, next) => {
    const author = await Author.findById(req.params.id).exec();
    if (author === null) {
        res.redirect('/catalog/author')
    }
    res.render('author_update', {
        title: 'Update Author',
        author: author
    })
})


exports.author_update_post = [

    body("first_name")
        .trim()
        .isLength({ min: 1 })
        .escape()
        .withMessage("Author name must be at least 1 characters long"),
    body("family_name")
        .trim()
        .isLength({ min: 1 })
        .escape()
        .withMessage("Author name must be at least 1 characters long"),
    body("Date of Birth", "Invalid date")
        .optional({ values: "falsy" })
        .isISO8601()
        .toDate(),
    body("Date of Death", "Invalid date")
        .optional({ values: "falsy" })
        .isISO8601()
        .toDate(),

    asyncHandler(async (req, res, next) => {
        const errors = validationResult(req);

        const author = new Author({
            first_name: req.body.first_name,
            family_name: req.body.family_name,
            date_of_birth: req.body.date_of_birth,
            date_of_death: req.body.date_of_death,
            _id: req.params.id
        })

        if(!errors.isEmpty()) {
            res.render({
                title: 'Update Author',
                author: author,
                errors: errors.array()
            })
            return;
        }else {
            await Author.findByIdAndUpdate(req.params.id, author, {});
            res.redirect(author.url);
        }
    })
]