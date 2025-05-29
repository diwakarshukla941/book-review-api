const Book = require('../models/Book');

// Add new book (authenticated users only)
exports.addBook = async (req, res) => {
  try {
    const { title, author, genre } = req.body;
    if (!title || !author || !genre) {
      return res.status(400).json({ message: 'Title, author, and genre are required.' });
    }

    const book = new Book({ title, author, genre });
    await book.save();
    res.status(201).json({ message: 'Book added', book });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get all books with pagination and optional filters
exports.getBooks = async (req, res) => {
  try {
    const { page = 1, limit = 10, author, genre } = req.query;

    const filter = {};
    if (author) filter.author = new RegExp(author, 'i');
    if (genre) filter.genre = new RegExp(genre, 'i');

    const books = await Book.find(filter)
      .skip((page - 1) * limit)
      .limit(parseInt(limit));

    const total = await Book.countDocuments(filter);

    res.json({
      page: parseInt(page),
      totalPages: Math.ceil(total / limit),
      totalBooks: total,
      books,
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get book details by ID (including average rating and paginated reviews)
exports.getBookById = async (req, res) => {
  try {
    const bookId = req.params.id;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 5;

    const book = await Book.findById(bookId);
    if (!book) return res.status(404).json({ message: 'Book not found' });

    const totalReviews = book.reviews.length;
    const start = (page - 1) * limit;
    const paginatedReviews = book.reviews.slice(start, start + limit);

    const avgRating =
      totalReviews === 0
        ? 0
        : book.reviews.reduce((sum, r) => sum + r.rating, 0) / totalReviews;

    res.json({
      book,
      averageRating: avgRating.toFixed(2),
      reviews: paginatedReviews,
      page,
      totalPages: Math.ceil(totalReviews / limit),
      totalReviews,
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Submit a review (authenticated users only, one review per user per book)
exports.addReview = async (req, res) => {
  try {
    const bookId = req.params.id;
    const userId = req.user.id;
    const { rating, comment } = req.body;

    if (!rating || rating < 1 || rating > 5) {
      return res.status(400).json({ message: 'Rating must be between 1 and 5' });
    }

    const book = await Book.findById(bookId);
    if (!book) return res.status(404).json({ message: 'Book not found' });

    const alreadyReviewed = book.reviews.some(
      (r) => r.user.toString() === userId
    );

    if (alreadyReviewed) {
      return res.status(400).json({ message: 'You have already reviewed this book' });
    }

    book.reviews.push({
      user: userId,
      rating,
      comment,
    });

    await book.save();
    res.status(201).json({ message: 'Review added', reviews: book.reviews });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Search books by title or author (case-insensitive partial match)
exports.searchBooks = async (req, res) => {
  try {
    const { q } = req.query;
    if (!q) {
      return res.status(400).json({ message: 'Search query is required' });
    }

    const regex = new RegExp(q, 'i');
    const books = await Book.find({
      $or: [{ title: regex }, { author: regex }],
    }).limit(20);

    res.json({ results: books });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};
