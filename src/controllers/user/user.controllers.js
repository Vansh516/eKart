const userCollection = require("../../models/user.models");
const expressAsyncHandler = require("express-async-handler");
const ApiResponse = require("../../utils/ApiResponse.utils");

const register = expressAsyncHandler(async (req, res, next) => {
  const { userName, email, password } = req.body;
  const newUser = await userCollection.create({ userName, email, password });

  new ApiResponse(201, true, "user registered successfully", newUser).send(res);
});

const login = expressAsyncHandler(async (req, res, next) => {});

const logout = expressAsyncHandler(async (req, res, next) => {});

module.exports = {
  register,
  login,
  logout,
};
