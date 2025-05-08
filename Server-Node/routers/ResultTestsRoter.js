
const express = require("express");
const router = express.Router();
const { TestCheck, getStudentTestResult, createResultTest } = require("../controllers/ResultTestsController");

router.post("/TestCheck", TestCheck); 
router.get("/getStudentTestResult/:TestId/:studentId", getStudentTestResult);
router.post("/createResultTest", createResultTest);

module.exports = router;
