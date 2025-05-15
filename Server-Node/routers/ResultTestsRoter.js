
const express = require("express");
const router = express.Router();
const { TestCheck, getStudentTestResult, createResultTest,getStudentTestResultByStudentID } = require("../controllers/ResultTestsController");

router.post("/TestCheck", TestCheck); 
router.get("/getStudentTestResult/:TestId/:studentId", getStudentTestResult);
router.post("/createResultTest", createResultTest);
router.get("/getStudentTestResultByStudentID/:studentId", getStudentTestResultByStudentID);
module.exports = router;
