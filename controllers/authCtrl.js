const jwt = require("jsonwebtoken");
const asyncErrorHandler = require("../utils/error/asyncErrorHandler");
const User = require("../models/User");
const AppError = require("../utils/error/appError");

const generateToken = async (id) => {
  try {
    const token = jwt.sign({ id }, process.env.JWT_SECRET, {
      expiresIn: "30d",
    });
    return token;
  } catch (error) {
    console.error("Error generating token:", error);

    throw new Error("Token generation failed");
  }
};

const verifyToken = asyncErrorHandler(async (req, res, next) => {
  const token = req.headers.authorization.split(" ")[1];
  console.log(token);
  if (token === null || token === undefined)
    return res.status(401).json({ msg: "plz provide token" });
  try {
    const decode = await jwt.verify(token, process.env.JWT_SECRET);
    if (!decode) {
      return next(new AppError("Invalid token", 401));
    }

    const user = await User.findById(decode.id);
    console.log(user);
    if (!user) {
      console.log("User not found");
      return next(new AppError("Invalid token", 403));
    }

    req.userId = decode.id;
    next();
  } catch (error) {
    return next(new AppError("Invalid token", 401));
  }
});

module.exports = {
  generateToken,
  verifyToken,
};
