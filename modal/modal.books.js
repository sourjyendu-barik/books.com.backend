const mongoose = require("mongoose");

const bookListSchema = new mongoose.Schema({
  id: { type: Number, required: true, unique: true },
  name: { type: String, required: true },
  image: { type: String, required: true },
  price: {
    originalPrice: { type: Number, required: true },
    discountedPrice: { type: Number, required: true },
  },
  category: {
    type: String,
    required: true,
    enum: ["Science", "Math", "History", "Geography", "Investment", "English"],
  },
  rating: { type: Number },
  isaddedinWishlist: { type: Boolean },
  bookDescription: [{ type: String, required: true }],
  returnPolicy: { type: String, required: true },
  cashOnDelivery: { type: Boolean, required: true },
  deliveryCharges: {
    applicable: { type: Boolean, required: true },
    charge: { type: Number, required: true },
  },
  author: { type: String, required: true },
});

const bookList = mongoose.model("bookList", bookListSchema);

module.exports = bookList;
