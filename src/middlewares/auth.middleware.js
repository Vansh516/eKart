const jwt = require("jsonwebtoken");
const expressAsyncHandler = require("express-async-handler");
const userCollection = require("../models/user.models");
const CustomError = require("../utils/CustomError.utils");

const authenticate = expressAsyncHandler(async (req, res, next) => {
  // console.log(req.cookies);

  console.log(req.body);
  console.log(req.file);

  let token = req?.cookies?.token; // optional chaining
  //   console.log(token);

  if (!token) return next(new CustomError("please log-in", 401));

  let decodedToken = jwt.verify(token, process.env.JWT_SECRET_KEY);
  console.log(decodedToken);

  let user = await userCollection.findById(decodedToken?.id);
  console.log(user);
  if (!user) return next(new CustomError("Invalid session", 401));

  req.myUser = user;
  next();
});

const authorize = expressAsyncHandler(async (req, res, next) => {
  if (req.myUser.role !== "admin") {
    return next(new CustomError("You are not authorized", 403));
  }
  next();
});

module.exports = { authenticate, authorize };
/* 
{
  token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY4OTQ4ZGEzNTE4Y2ViNGY1YmQwOTI4NyIsImlhdCI6MTc1NDk5ODA2OSwiZXhwIjoxNzU1MDg0NDY5fQ.eOKw-ktEjQPRbLAEWfjXEsmpf1mqoGleYU49BRWulHk'
}

{ id: '68948da3518ceb4f5bd09287', iat: 1754998543, exp: 1755084943 }

*/
