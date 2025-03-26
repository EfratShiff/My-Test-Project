// const express = require("express")
// const router = express.Router()


// const {TestCheck ,getStudentTestResult,createResultTest}= require("../controllers/ResultTestsController")
// router.get("/TestCheck/:TestId/:studentId/:answers",TestCheck)
// router.get("/getStudentTestResult/:TestId/:studentId", getStudentTestResult); 
// router.post("/createResultTest",createResultTest)


// module.exports= router

const express = require("express");
const router = express.Router();
const { TestCheck, getStudentTestResult, createResultTest } = require("../controllers/ResultTestsController");

router.post("/TestCheck", TestCheck);  // שינוי לפוסט במקום גט
router.get("/getStudentTestResult/:TestId/:studentId", getStudentTestResult);
router.post("/createResultTest", createResultTest);

module.exports = router;
