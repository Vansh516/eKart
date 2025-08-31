const userCollection = require('../../models/user.models');
const expressAsyncHandler = require('express-async-handler');
const ApiResponse = require('../../utils/ApiResponse.utils');

const {
  registervalidation,
  loginValidattion,
  updatedUserValidation,
  updateUserPassword,
} = require('../../validations/user.validations');

const CustomError = require('../../utils/CustomError.utils');
const { generateToken } = require('../../utils/jwt.utils');

const register = expressAsyncHandler(async (req, res, next) => {
  const { error } = registervalidation.validate(req.body);
  if (error) {
    throw new CustomError(error.details[0].message, 400);
  }

  const { userName, email, password } = req.body;
  const newUser = await userCollection.create({ userName, email, password });

  new ApiResponse(201, true, 'user registered successfully', newUser).send(res);
});

const login = expressAsyncHandler(async (req, res, next) => {
  const { error } = loginValidattion.validate(req.body);
  if (error) {
    throw new CustomError(error.details[0].message, 400);
  }

  const { email, password } = req.body;
  const user = await userCollection.findOne({ email }).select('+password');
  console.log(user);

  if (!user) return next(new CustomError('Invalid credentials', 400));

  let isMatch = await user.comparePassword(password);
  if (!isMatch) return next(new CustomError('Invalid credentials', 400));

  let token = await generateToken(user._id);
  console.log(token);

  res.cookie('token', token, {
    maxAge: 1 * 60 * 60 * 1000,
  });

  new ApiResponse(200, true, 'User logged in', user, token).send(res);
});

const logout = expressAsyncHandler(async (req, res, next) => {
  res.clearCookie('token');
  new ApiResponse(200, true, 'user logged out').send(res);
});

const updateProfile = expressAsyncHandler(async (req, res, next) => {
  const { error } = updatedUserValidation.validate(req.body);
  if (error) {
    throw new CustomError(error.details[0].message, 400);
  }

  let userId = req.myUser._id;
  let { userName, email } = req.body;
  let updatedUser = await userCollection.findByIdAndUpdate(
    userId,
    {
      userName,
      email,
    },
    {
      new: true, // it displays the updated data
    }
  );

  // if(!updatedUser) return next()

  new ApiResponse(200, true, 'user profile updated', updatedUser).send(res);
});

const updatePassword = expressAsyncHandler(async (req, res, next) => {
  const { error } = updateUserPassword.validate(req.body);
  if (error) {
    throw new CustomError(error.details[0].message, 400);
  }

  let userId = req.myUser._id;
  let user = await userCollection.findById(userId);

  user.password = req.body.password;
  await user.save();

  new ApiResponse(200, true, 'passowrd updated').send(res);
});

const deleteProfile = expressAsyncHandler(async (req, res, next) => {
  let userId = req.myUser._id;
  let deletedprofile = await userCollection.findByIdAndDelete(userId);
  new ApiResponse(200, true, 'profile deleted', deletedprofile).send(res);
});

//TODO:
const resetPassword = expressAsyncHandler(async (req, res, next) => {});

module.exports = {
  register,
  login,
  logout,
  updateProfile,
  deleteProfile,
  updatePassword,
};
