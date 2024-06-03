const express = require('express');
const router = express.Router();

// Require the modules
const book_controller = require('../controllers/bookController');
const author_controller = require('../controllers/authorController');
const genre_controller = require('../controllers/genreController');
const book_instance_controller = require('../controllers/bookinstanceController');

//  Book routes.

//home Catalog page
router.get('/', book_controller.index);

// Get Create book
router.get('/book/create', book_controller.book_create_get);

//post Create book
router.post('/book/create', book_controller.book_create_post);

// Get Delete book
router.get('/book/:id/delete', book_controller.book_delete_get);

//post Delete book
router.post('/book/:id/delete', book_controller.book_delete_post);

// Get Update book
router.get('/book/:id/update', book_controller.book_update_get);

//post Update book
router.post('/book/:id/update', book_controller.book_update_post);

//get one book
router.get('/book/:id', book_controller.book_detail);

//get all books
router.get('/books', book_controller.book_list);


//  Author routes.

// Get Create author
router.get('/author/create', author_controller.author_create_get);

//post Create author
router.post('/author/create', author_controller.author_create_post); 

// Get Delete author
router.get('/author/:id/delete', author_controller.author_delete_get);

//post Delete author
router.post('/author/:id/delete', author_controller.author_delete_post);

// Get Update author
router.get('/author/:id/update', author_controller.author_update_get);

//post Update author
router.post('/author/:id/update', author_controller.author_update_post);

//get one author
router.get('/author/:id', author_controller.author_detail);

//get all authors
router.get('/authors', author_controller.author_list);


//  Genre routes.

// Get Create genre
router.get('/genre/create', genre_controller.genre_create_get);

//post Create genre
router.post('/genre/create', genre_controller.genre_create_post);

// Get Delete genre
router.get('/genre/:id/delete', genre_controller.genre_delete_get);

//post Delete genre
router.post('/genre/:id/delete', genre_controller.genre_delete_post);

// Get Update genre
router.get('/genre/:id/update', genre_controller.genre_update_get);

//post Update genre
router.post('/genre/:id/update', genre_controller.genre_update_post);

//get one genre
router.get('/genre/:id', genre_controller.genre_detail);

//get all genres
router.get('/genres', genre_controller.genre_list);


//  Bookinstance routes.

// Get Create bookinstance
router.get('/bookinstance/create', book_instance_controller.bookinstance_create_get);

//post Create bookinstance
router.post('/bookinstance/create', book_instance_controller.bookinstance_create_post);

// Get Delete bookinstance
router.get('/bookinstance/:id/delete', book_instance_controller.bookinstance_delete_get);

//post Delete bookinstance  
router.post('/bookinstance/:id/delete', book_instance_controller.bookinstance_delete_post);

// Get Update bookinstance
router.get('/bookinstance/:id/update', book_instance_controller.bookinstance_update_get);

//post Update bookinstance
router.post('/bookinstance/:id/update', book_instance_controller.bookinstance_update_post);

//get one bookinstance
router.get('/bookinstance/:id', book_instance_controller.bookinstance_detail);

//get all bookinstances
router.get('/bookinstances', book_instance_controller.bookinstance_list);


module.exports = router