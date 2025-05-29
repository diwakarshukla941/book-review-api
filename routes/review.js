const express = require('express');
const router = express.Router();
const reviewController = require('../controllers/reviewController');
const authMiddleware = require('../middleware/authMiddleware');

// Submit review (authenticated)
router.post('/books/:id/reviews', authMiddleware, reviewController.addReview);

// Update your review
router.put('/reviews/:id', authMiddleware, reviewController.updateReview);

// Delete your review
router.delete('/reviews/:id', authMiddleware, reviewController.deleteReview);

// Get book details with average rating and reviews (no auth needed)
router.get('/books/:id', reviewController.getBookDetails);

module.exports = router;
