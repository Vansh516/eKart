const mongoose = require("mongoose");
const expressAsyncHandler = require("express-async-handler");

const connectDB = expressAsyncHandler(async () => {
  await mongoose.connect(process.env.MONGODB_URL);
  console.log("database connected");
});

module.exports = { connectDB };
