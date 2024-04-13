const Job = require("../models/Job");
const ApiFeatures = require("../utils/apiFeature");
const AppError = require("../utils/error/appError");
const asyncErrorHandler = require("../utils/error/asyncErrorHandler");

const createJob = asyncErrorHandler(async (req, res, next) => {
  const {
    title,
    techStack,
    companyName,
    companyWebsite,
    status,
    deadLine,
    appliedDate,
  } = req.body;
  // const todoEventDate = new Date(eventDate);
  // console.log(new Date(Date.now()));
  // console.log(todoEventDate);
  // if (todoEventDate < new Date(Date.now()))
  //   return res.status(400).json({ status: false, msg: "Invalid date" });
  const userId = req.userId;
  const jobs = {
    title,
    techStack,
    companyName,
    companyWebsite,
    status,
    deadLine,
    appliedDate,
    userId,
  };
  const newTodo = await Job.create(jobs);
  res.status(201).json({
    status: true,
    msg: "Job created",
    data: newTodo,
  });
});

const getJob = asyncErrorHandler(async (req, res, next) => {
  const apiFeature = new ApiFeatures(
    Job.find({ user_id: req.userId }),
    req.query
  )
    .filter()
    .sort()
    .limitFields()
    .paginate();
  const todos = await apiFeature.query;
  if (!todos) return next(new AppError("Not found", 404));

  res.status(200).json({
    status: true,
    results: todos.length,
    data: todos,
  });
});

const getJobById = asyncErrorHandler(async (req, res, next) => {
  const todo = await Job.findById(req.params.id);
  if (!todo) {
    return next(new AppError("Not found", 404));
  }
  if (todo.user_id != req.userId) {
    return next(new AppError("Forbiden", 403));
  }

  res.status(200).json({
    status: true,
    data: todo,
  });
});

module.exports = {
  createJob,
  getJob,
  getJobById,
};