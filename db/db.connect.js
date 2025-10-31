const mongoose = require("mongoose");
require("dotenv").config();

const MongoUri = process.env.MONGODB;

const initializeDb = async () => {
  await mongoose
    .connect(MongoUri)
    .then(() => console.log("Connect db successfully."))
    .catch(() => console.log("Error while connecting to db."));
};

module.exports = { initializeDb };
