const mongoose = require("mongoose");
const asyncErrorHandler = require("./error/asyncErrorHandler");

const dbConnect = async () => {
  const conn = await mongoose.connect(process.env.MONGO_URL);
  console.log(`Mongodb is connected on ${conn.connection.host}`);
};

module.exports = dbConnect;
