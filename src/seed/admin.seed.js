const userCollection = require("../models/user.models");
const expressAsyncHandler = require("express-async-handler");
const CustomError = require("../utils/CustomError.utils");

const seedAdmin = async () => {
  let admin = await userCollection.findOne({ role: "admin" });
  if (admin) {
    console.log("admin details already present");
    return;
  } else {
    let adminDetails = {
      userName: "admin",
      email: "admin@gmail.com",
      password: "admin",
      role: "admin",
    };

    await userCollection.create(adminDetails);
    console.log("admin details added!!!");
  }
};

module.exports = { seedAdmin };
