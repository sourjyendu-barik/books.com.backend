const mongoose = require("mongoose");

const initializeDb = async () => {
  try {
    await mongoose.connect(process.env.MONGODB);
    console.log("Connected to MongoDB");
  } catch (err) {
    console.error("MongoDB connection failed:", err);
    throw err;
  }
};

module.exports = { initializeDb };
