const Author = require("../models/author");
const Book = require("../models/book");
const asyncHandler = require("express-async-handler");
const { body, validationResult} = require("express-validator");

exports.author_list = asyncHandler(async (req, res, next) => {
    const allAuthors = await Author.find().sort({name: 1}).exec();
    console.log("Debug: " + allAuthors);
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
    res.send("NOT IMPLEMENTED: Author delete GET");
})

exports.author_delete_post = asyncHandler(async (req, res, next) => {
    res.send("NOT IMPLEMENTED: Author delete POST");
})

exports.author_update_get = asyncHandler(async (req, res, next) => {
    res.send("NOT IMPLEMENTED: Author update GET");
})


exports.author_update_post = asyncHandler(async (req, res, next) => {
    res.send("NOT IMPLEMENTED: Author update Post");
})