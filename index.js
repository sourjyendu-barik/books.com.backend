const { initializeDb } = require("./db/db.connect");
const bookList = require("./modal/modal.books");
const express = require("express");
const cookieParser = require("cookie-parser");
const dotenv = require("dotenv");
const cors = require("cors");

dotenv.config();
const app = express();

// 1. Disable ETag caching so Express never sends 304 Not Modified (which strips CORS headers on Vercel)
app.disable("etag");

// 2. Disable response caching for API routes
app.use((req, res, next) => {
  res.set("Cache-Control", "no-store, no-cache, must-revalidate, private");
  next();
});

// 3. Dynamic CORS Configuration
const allowedOrigins = [
  "http://localhost:5173",
  "https://books-com.vercel.app",
];

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, origin || true);
      } else {
        callback(null, false);
      }
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  }),
);

app.use(cookieParser());
app.use(express.json());

// 4. Ensure DB connection on Vercel Serverless Function invocations
app.use(async (req, res, next) => {
  try {
    await initializeDb();
    next();
  } catch (error) {
    console.error("DB connection error:", error);
    res.status(500).json({ message: "Database connection failed", error });
  }
});

// Public auth routes (Google callback)
app.use("/auth", require("./router/authRoutes"));

// Protected Middleware
const auth = require("./middilewire/auth");
app.use(auth);

// Protected routes
app.use("/auth", require("./router/userDetails"));

const findAllBooks = async () => {
  try {
    const allBooks = await bookList.find();
    return allBooks;
  } catch (error) {
    throw error;
  }
};

app.get("/api/products", async (req, res) => {
  try {
    const allBooksData = await findAllBooks();
    if (allBooksData.length > 0) {
      res.status(200).json({ data: { products: allBooksData } });
    } else {
      res.status(404).json({ message: "Books data not found" });
    }
  } catch (error) {
    res
      .status(400)
      .json({ message: "Error while fetching all books data", error });
  }
});

const findBookById = async (book_id) => {
  try {
    const bookData = await bookList.findById(book_id);
    return bookData;
  } catch (error) {
    throw error;
  }
};

app.get("/api/products/:productId", async (req, res) => {
  try {
    const book = await findBookById(req.params.productId);
    if (book) {
      res.status(200).json({ data: { product: book } });
    } else {
      res.status(404).json({ message: "Book data not found" });
    }
  } catch (error) {
    res
      .status(400)
      .json({ message: "Error while fetching books data by id.", error });
  }
});

const findCategoryList = async () => {
  try {
    const categoryList = await bookList.distinct("category");
    return categoryList;
  } catch (error) {
    throw error;
  }
};

app.get("/api/categories", async (req, res) => {
  try {
    const categoryList = await findCategoryList();
    if (categoryList.length > 0) {
      res.status(200).json({
        data: {
          categories: categoryList,
        },
      });
    } else {
      res.status(404).json({ message: "Data not found" });
    }
  } catch (error) {
    res
      .status(400)
      .json({ message: "Error while fetching category list.", error });
  }
});

const port = process.env.PORT || 4000;
if (process.env.NODE_ENV !== "production") {
  app.listen(port, () => {
    console.log("Server is running on port", port);
  });
}

// 5. Export Express app for Vercel Serverless deployment
module.exports = app;
