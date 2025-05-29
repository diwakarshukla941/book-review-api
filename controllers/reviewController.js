const Book = require('../models/Book');

// Submit a review (one review per user per book)
exports.addReview = async (req, res) => {
  try {
    const { id: bookId } = req.params;
    const { rating, comment } = req.body;
    const userId = req.user.id; // from auth middleware

    const book = await Book.findById(bookId);
    if (!book) return res.status(404).json({ message: 'Book not found' });

    // Check if user already reviewed
    const existingReview = book.reviews.find(r => r.user.toString() === userId);
    if (existingReview) {
      return res.status(400).json({ message: 'You already reviewed this book' });
    }

    // Add new review
    book.reviews.push({ user: userId, rating, comment });
    await book.save();

    res.status(201).json({ message: 'Review added', review: book.reviews[book.reviews.length - 1] });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Update your review
exports.updateReview = async (req, res) => {
  try {
    const { id: reviewId } = req.params;
    const { rating, comment } = req.body;
    const userId = req.user.id;

    // Find book containing the review
    const book = await Book.findOne({ 'reviews._id': reviewId });
    if (!book) return res.status(404).json({ message: 'Review not found' });

    const review = book.reviews.id(reviewId);
    if (review.user.toString() !== userId) {
      return res.status(403).json({ message: 'Not authorized to update this review' });
    }

    // Update fields
    if (rating) review.rating = rating;
    if (comment) review.comment = comment;

    await book.save();

    res.json({ message: 'Review updated', review });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Delete your review
exports.deleteReview = async (req, res) => {
  try {
    const { id: reviewId } = req.params;
    const userId = req.user.id;

    const book = await Book.findOne({ 'reviews._id': reviewId });
    if (!book) return res.status(404).json({ message: 'Review not found' });

    const review = book.reviews.id(reviewId);
    if (review.user.toString() !== userId) {
      return res.status(403).json({ message: 'Not authorized to delete this review' });
    }

    review.remove();
    await book.save();

    res.json({ message: 'Review deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get book details with average rating and paginated reviews
exports.getBookDetails = async (req, res) => {
  try {
    const { id: bookId } = req.params;
    const { page = 1, limit = 5 } = req.query;

    const book = await Book.findById(bookId).populate('reviews.user', 'username');
    if (!book) return res.status(404).json({ message: 'Book not found' });

    const reviews = book.reviews;
    const totalReviews = reviews.length;

    // Calculate average rating
    const avgRating = totalReviews === 0
      ? 0
      : reviews.reduce((acc, r) => acc + r.rating, 0) / totalReviews;

    // Pagination
    const start = (page - 1) * limit;
    const end = start + parseInt(limit);
    const pagedReviews = reviews.slice(start, end);

    res.json({
      book: {
        id: book._id,
        title: book.title,
        author: book.author,
        genre: book.genre,
        createdAt: book.createdAt,
      },
      averageRating: avgRating.toFixed(2),
      reviews: pagedReviews,
      page: parseInt(page),
      totalPages: Math.ceil(totalReviews / limit),
      totalReviews,
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};
