const validator = require("validator");
const AppError = require("../utils/error/appError");
const asyncErrorHandler = require("../utils/error/asyncErrorHandler");
const User = require("../models/User");
const ApiFeatures = require("../utils/apiFeature");
const bcrypt = require("bcryptjs");
const { generateToken } = require("../controllers/authCtrl");

const signup = asyncErrorHandler(async (req, res, next) => {
  if (!validator.isEmail(req.body.email)) {
    return next(new AppError("Invalid email", 400));
  }

  const user = await User.findOne({ email: req.body.email });
  console.log(req.body);
  if (user) {
    return next(new AppError("User exist with this email", 400));
  }

  const salt = await bcrypt.genSalt(12);
  const hashedPassword = await bcrypt.hash(req.body.password, salt);

  const newUser = await User.create({
    name: req.body.name,
    email: req.body.email,
    password: hashedPassword,
  });
  console.log(newUser);

  res.json(newUser);
});

const login = asyncErrorHandler(async (req, res, next) => {
  console.log(req.body);
  const user = await User.findOne({ email: req.body.email }).select({
    "+password": true,
  });
  console.log(user);
  if (!user) {
    return next(new AppError("Invalid credentials", 404));
  }
  const isPasswordValid = await bcrypt.compare(
    req.body.password,
    user.password
  );
  if (isPasswordValid) {
    const token = await generateToken(user._id);

    res.cookie("token", token, {
      httpOnly: true,
      // Add other cookie options if needed
    });

    delete user.password;

    res.status(200).json({ status: true, user, token });
  } else {
    return next(new AppError("Invalid credentials", 401));
  }
});

const getUser = asyncErrorHandler(async (req, res, next) => {
  const apiFeature = new ApiFeatures(User.find(), req.query)
    .filter()
    .sort()
    .limitFields()
    .paginate();
  const users = await apiFeature.query;

  if (!users) {
    return next(new AppError("Not found", 404));
  }

  res.status(200).json({ status: true, result: users.length, data: users });
});

const updateUser = asyncErrorHandler(async (req, res, next) => {
  const user = await User.findById(req.userId);
  if (!user) {
    return next(new AppError("Invalid user", 400));
  }

  const updatedUser = await User.findByIdAndUpdate(req.userId, req.body);

  res
    .status(200)
    .json({ status: true, msg: "User updated successfully", data: updateUser });
});

module.exports = {
  signup,
  login,
  getUser,
  updateUser,
};
