const express = require("express");
const swaggerUi = require("swagger-ui-express");
const swaggerSpec = require("./utils/swagger");
const morgan = require("morgan");
const fileUpload = require("express-fileupload");

const dotenv = require("dotenv").config();

//internal dependencies
const dbConnect = require("./utils/db");

const cors = require("cors");
const limiter = require("./middleware/rateLimit");
const helmet = require("helmet");
const mongoSanitize = require("express-mongo-sanitize");
const hpp = require("hpp");
const errorHandler = require("./utils/error/errorHandler");
const AppError = require("./utils/error/appError");
const userRoute = require("./routes/userRoute");
const jobsRoutes = require("./routes/jobsRoutes");
const fileUploadRoute = require("./routes/fileUploadRoutes");

process.on("uncaughtException", (err) => {
  console.log("uncaughtException");
  console.log(err.name, err.message);
  process.exit(1);
});

//db connection
dbConnect();

const app = express();

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.use(cors());
app.use(express.json());
app.use(limiter);
app.use(helmet());
app.use(mongoSanitize());
app.use(hpp());

app.use(fileUpload());

if (process.env.NODE_ENV === "dev") {
  app.use(morgan("dev"));
}

//Routes

app.use("/api/v1", userRoute);
app.use("/api/v1", jobsRoutes);
app.use("/api/v1", fileUploadRoute);

app.all("*", (req, res, next) => {
  next(new AppError("Invalid URL", 404));
});

app.use(errorHandler);

const PORT = process.env.PORT || 8080;
const server = app.listen(PORT, console.log(`App is running on port ${PORT}`));

process.on("unhandledRejection", (err) => {
  console.log("UNHADLE REJECTION");
  console.log(err.name, err.message);

  server.close(() => {
    process.exit(1);
  });
});
