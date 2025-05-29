const express = require('express');
const router = express.Router();
const bookController = require('../controllers/bookController');
const authMiddleware = require('../middleware/authMiddleware');

// Add a new book (auth required)
router.post('/books', authMiddleware, bookController.addBook);

// Get all books (pagination and filters)
router.get('/books', bookController.getBooks);

// Get book details by ID (including reviews)
router.get('/books/:id', bookController.getBookById);

// Submit a review for a book (auth required)
router.post('/books/:id/reviews', authMiddleware, bookController.addReview);

// Search books by title or author (no auth required)
router.get('/search', bookController.searchBooks);

module.exports = router;
