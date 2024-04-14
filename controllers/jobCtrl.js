const Job = require("../models/Job");
const ApiFeatures = require("../utils/apiFeature");
const ApiQuery = require("../utils/apiQuery");
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
  const newJob = await Job.create(jobs);
  res.status(201).json({
    status: true,
    msg: "Job created",
    data: newJob,
  });
});

const getJob = asyncErrorHandler(async (req, res, next) => {
  const todos = [];
  // const sort = {};
  // if (req.query.sort) {
  //   sort[req.query.sort] = -1; // Assuming sorting in ascending order
  // }
  // const result = await Job.paginate(
  //   { userId: req.userId },
  //   {
  //     page: req.query.page || 1,
  //     limit: req.query.limit || 10,
  //     sort: sort, // Example sorting by _id in descending order
  //   }
  // );

  // console.log(result);
  // if (!todos) return next(new AppError("Not found", 404));

  const jobQuery = new ApiQuery(Job);
  const result = await jobQuery.findWithFilterAndPagination(
    req.query,
    req.userId
  );
  res.status(200).json({
    status: true,
    results: result.totalDocs,
    data: result.docs,
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

const updateJob = asyncErrorHandler(async (req, res, next) => {
  const userId = req.userId;
  const fieldsToUpdate = {
    title: req.body.title,
    techStack: req.body.techStack,
    companyName: req.body.companyName,
    companyWebsite: req.body.companyWebsite,
    status: req.body.status,
    deadLine: req.body.deadLine,
    appliedDate: req.body.appliedDate,
  };

  const jobToUpdate = await Job.findOne({ _id: req.params.id, userId });
  if (!jobToUpdate) return next(new AppError("Job not found", 404));

  Object.keys(fieldsToUpdate).forEach((field) => {
    if (fieldsToUpdate[field] !== null && fieldsToUpdate[field] !== undefined) {
      jobToUpdate[field] = fieldsToUpdate[field];
    }
  });

  const updatedJob = await jobToUpdate.save();

  res.status(200).json({
    status: true,
    msg: "Job updated",
    data: updatedJob,
  });
});

module.exports = {
  createJob,
  getJob,
  getJobById,
  updateJob,
};
