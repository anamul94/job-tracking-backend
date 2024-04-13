const AppError = require("../utils/error/appError");
const path = require("path");

const fileUpload = (req, res, next) => {
  if (!req.files) {
    return next(new AppError("plz provide file", 400));
  }
  const file = req.files.file;
  const supportedFiles = [".png", ".pdf"];
  if (!supportedFiles.includes(path.extname(file.name)))
    return next(new AppError("File format not supported", 400));

  if (file.size > 20000000)
    return next(new AppError("File size too large", 400));
  file.name = Math.random() + path.extname(file.name);
  console.log(file.name);
  const filepath = "./public";

  file.mv("./public/" + file.name, async (err) => {
    if (err) return next(new AppError("File upload failed", 500));
    res.status(200).json({ status: true, msg: "file upload successfull" });
  });
};

module.exports = {
  fileUpload,
};
