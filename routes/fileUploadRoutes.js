const express = require("express");
const router = express.Router();

const fileUploadCtrl = require("../controllers/fileUploadCtrl");

router.post("/upload", fileUploadCtrl.fileUpload);

module.exports = router;
