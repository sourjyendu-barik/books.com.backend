const { initializeDb } = require("./db/db.connect");
const bookList = require("./modal/modal.books");
const express = require("express");
const app = express();
app.use(express.json());
//seeding data code(no express required)
// const fs = require("fs");
// const jsonData = fs.readFileSync("data.json", "utf-8");
// const booksData = JSON.parse(jsonData);

// const seedData = async () => {
//   try {
//     await initializeDb();
//     await bookList.insertMany(booksData);
//     console.log("Data seeded successfully.");
//   } catch (error) {
//     console.log("Error while seding data", error);
//   }
// };
// seedData();
const cors = require("cors");
const corsOptions = {
  origin: "*",
  credentials: true,
  optionSuccessStatus: 200,
};

app.use(cors(corsOptions));

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
      .json({ message: "Error while fetching  books data by id.", error });
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
      res.status(404).json({ message: "Data bot found" });
    }
  } catch (error) {
    res
      .status(400)
      .json({ message: "Error while fetching category list.", error });
  }
});

// const findProductByCategory = async (categoryName) => {
//   try {
//     const products = await bookList.find({ category: categoryName });
//     return products;
//   } catch (error) {
//     throw error;
//   }
// };

// app.get("/api/categories/:categoryId", async (req, res) => {
//   try {
//     const books = await findProductByCategory(req.params.categoryId);
//     if (books.length > 0) {
//         res.status(200).json({})
//     } else {
//     }
//   } catch (error) {
//     res.status(400).json({ message: "Error while fetching products.", error });
//   }
// });

(async () => {
  await initializeDb();
})();

module.exports = app;
