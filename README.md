
# 📚 Book Review API

A secure RESTful API built with Node.js, Express, and MongoDB for user authentication and book reviews. Features JWT-based authentication, user registration/login, and the ability to leave ratings and comments on books.

---

## 🚀 Features

- 🔐 User Signup & Login with JWT Authentication
- 🧂 Passwords hashed with bcrypt
- 📚 Book management with review functionality
- 🧾 MongoDB schemas for User, Book, and Review
- 🛡️ Protected routes using middleware

---

## 🛠️ Tech Stack

- **Backend:** Node.js, Express.js
- **Database:** MongoDB with Mongoose
- **Authentication:** JWT (JSON Web Token)
- **Security:** bcrypt for password hashing
- **Environment:** dotenv for environment variables

---

## 📁 Folder Structure

```
.
├── models
│   ├── User.js
│   └── Book.js
├── controllers
│   └── authController.js
│   └── bookController.js
│   └── reviewController.js
├── middleware
│   └── authMiddleware.js
├── routes
│   └── auth.js
│   └── book.js
│   └── review.js
├── .env
├── server.js
└── README.md
```

---

## 📦 Installation

1. **Clone the repo**
   ```bash
   git clone https://github.com/diwakarshukla941/book-review-api.git
   cd book-review-api
   ```

2. **Install dependencies**
   ```bash
   npm install
   npm install express mongoose bcrypt jsonwebtoken dotenv
   npm install --save-dev nodemon
   ```

3. **Set up environment variables**

   Create a `.env` file:

   ```env
    PORT=5000
    MONGO_URI=mongodb://127.0.0.1:27017/bookReviewDB
    JWT_SECRET=superSecretKey

   ```

4. **Run the server**
   ```bash
   npm start
   ```

---

## 🔑 API Endpoints

### Auth

- **POST** `/api/auth/signup`  
  Register a new user  
  **Body:**  
  ```json
  {
    "username": "john",
    "email": "john@example.com",
    "password": "yourpassword"
  }
  ```

- **POST** `/api/auth/login`  
  Login and receive JWT token  
  **Body:**  
  ```json
  {
    "username": "john",
    "password": "yourpassword"
  }
  ```

---

### Books

- **POST** `/api/books`  
  Add a new book (authenticated users only)  
  **Headers:**  
  `Authorization: Bearer <token>`  
  **Body:**  
  ```json
  {
    "title": "The Great Gatsby",
    "author": "F. Scott Fitzgerald",
    "genre": "Fiction"
  }
  ```

- **GET** `/api/books`  
  Get all books with optional pagination and filters  
  **Query Parameters (optional):**  
  ```json
  {
    "page": 1,
    "limit": 10,
    "author": "fitzgerald",
    "genre": "fiction"
  }
  ```

- **GET** `/api/books/:id`  
  Get book details by ID, including average rating and paginated reviews  
  **Query Parameters (optional):**  
  ```json
  {
    "page": 1,
    "limit": 5
  }
  ```

---

### Reviews

- **POST** `/api/books/:id/reviews`  
  Submit a review for a book (authenticated users only, one review per user per book)  
  **Headers:**  
  `Authorization: Bearer <token>`  
  **Body:**  
  ```json
  {
    "rating": 4,
    "comment": "Great read!"
  }
  ```

---

### Search

- **GET** `/api/books/search`  
  Search books by title or author (case-insensitive partial match)  
  **Query Parameters:**  
  ```json
  {
    "q": "gatsby"
  }
  ```

---


## 📝 Schema Overview

### User

```js
{
  username: String,
  email: String,
  passwordHash: String,
  createdAt: Date
}
```

### Book

```js
{
  title: String,
  author: String,
  genre: String,
  reviews: [
    {
      user: ObjectId,
      rating: Number,
      comment: String,
      createdAt: Date
    }
  ],
  createdAt: Date
}
```

---

## 👤 Author

**Diwakar Shukla**  
GitHub: [@diwakarshukla941](https://github.com/diwakarshukla941)  
LinkedIn: [Diwakar Shukla](https://www.linkedin.com/in/diwakar-shukla-252a4a19b/)

---

## 📃 License

This project is licensed under the MIT License.
