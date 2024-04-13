const express = require("express");
const Router = express.Router();
const authCtrl = require("../controllers/authCtrl");
const jobCtrl = require("../controllers/jobCtrl");

Router.post("/jobs", authCtrl.verifyToken, jobCtrl.createJob);

Router.get("/jobs", authCtrl.verifyToken, jobCtrl.getJob);

Router.get("/jobs/:id", authCtrl.verifyToken, jobCtrl.getJobById);

Router.patch("/jobs/:id", authCtrl.verifyToken, jobCtrl.updateJob);

module.exports = Router;
