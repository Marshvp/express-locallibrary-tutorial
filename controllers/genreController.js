const Genre = require('../models/genre');
const Book = require('../models/book');
const asyncHandler = require('express-async-handler');
const { body, validationResult } = require('express-validator');


exports.genre_list = asyncHandler(async (req, res, next) => {
    const allGenres = await Genre.find().sort({ name: 1 }).exec();
    res.render('genre_list', { 
        title: 'Genre List', 
        genre_list: allGenres 
    })
})


exports.genre_detail = asyncHandler(async (req, res, next) => {
// Get details of genre and all associated books (in parallel)
const [genre, booksInGenre] = await Promise.all([
    Genre.findById(req.params.id).exec(),
    Book.find({ genre: req.params.id }, "title summary").exec(),
]);
if (genre === null) {
    // No results.
    const err = new Error("Genre not found");
    err.status = 404;
    return next(err);
}

res.render("genre_detail", {
    title: "Genre Detail",
    genre: genre,
    genre_books: booksInGenre,
});
});



exports.genre_create_get = (req, res, next) => {
    res.render('genre_form', {
        title: 'Create Genre',
    });
}

exports.genre_create_post = [ 
    
    body('name', 'Genre name is required')
        .trim()
        .isLength({ min: 3 })
        .escape(),


    asyncHandler(async (req, res, next) => {
        const errors = validationResult(req);
        const genre = new Genre({ name: req.body.name });

        if(!errors.isEmpty()) {
            res.render('genre_form',{
                title: 'Create Genre',
                genre: genre,
                errors: errors.array()
            })
        return;
        } else {
            const genreExists = await Genre.findOne({ name: req.body.name })
                .collation({ locale: 'en', strength: 2 })
                .exec();
            
            if(genreExists) {
                res.redirect(genreExists.url);
            } else {
                await genre.save();
                res.redirect(genre.url);
            }
        }
    }),
]

exports.genre_delete_get = asyncHandler(async (req, res, next) => {
    const [ genre, allBookInGenre ] = await Promise.all([
        Genre.findById(req.params.id).exec(),
        Book.find({ genre: req.params.id }, "title summary").exec()
    ])

    if (genre === null) {
        res.redirect('/catalog/genre')
    }

    res.render('genre_delete', {
        title: "Delete Genre",
        genre: genre,
        genre_books: allBookInGenre
    })
})

exports.genre_delete_post = asyncHandler(async (req, res, next) => {
    const [ genre, allBookInGenre ] = await Promise.all([
        Genre.findById(req.params.id).exec(),
        Book.find({ genre: req.params.id }, "title summary").exec()
    ])

    if (allBookInGenre.length > 0) {
        res.render('genre_delete', {
            title: 'Delete Genre',
            genre: genre,
            genre_books: allBookInGenre
        })
    } else {
        await Genre.findByIdAndDelete(req.body.genreid);
        res.redirect('/catalog/genre')
    }
})

exports.genre_update_get = asyncHandler(async (req, res, next) => {
    const genre = await Genre.findById(req.params.id).exec();
    if (genre === null) {
        res.redirect('/catalog/genre')
    }
    res.render('genre_update', {
        title: 'Update Genre',
        genre: genre
    })
})

exports.genre_update_post = [

    body('name', 'Genre name is required')
        .trim()
        .isLength({ min: 3 })
        .escape(),

    asyncHandler(async (req, res, next) => {
        const errors = validationResult(req);

        const genre = new Genre({
            name: req.body.name,
            _id: req.params.id
        })

        if(!errors.isEmpty()) {
            res.render('genre_form', {
                title: 'Update Genre',
                genre: genre,
                errors: errors.array()
            })
            return;
        } else{
            await Genre.findByIdAndUpdate(req.params.id, genre, {});
            res.redirect(genre.url);
        }
    })
]